import test = require("tape");

import { fileAnalysis } from "../../visitors/types";
import getMissingTemplatesErrors from "../../lint/missing-templates";

test("won't return errors if there are not templates", t => {
  t.deepEqual(getMissingTemplatesErrors(fileAnalysis({}), [], {}), []);
  t.deepEqual(
    getMissingTemplatesErrors(fileAnalysis({ templates: [] }), [], {}),
    []
  );
  t.end();
});

test("it should not complain if templates used in source are in the resource modules", t => {
  t.deepEqual(
    getMissingTemplatesErrors(
      fileAnalysis({
        templates: [{ module: "m1", fileName: "Drawer.hogan" }]
      }),
      [["m1", { templates: { "Drawer.hogan": "./banana/phone.hogan" } }]],
      {}
    ),
    []
  );
  t.end();
});

test("it should list templates used in source that are not in the resource modules", t => {
  const s1 = { module: "m1", fileName: "Drawer.hogan" };
  const s2 = { module: "m1", fileName: "Banana.hogan" };
  const s3 = { module: "m1", fileName: "Phone.hogan" };
  const m1 = { templates: { "Drawer.hogan": "./drawer/drawer.hogan" } };
  t.deepEqual(
    getMissingTemplatesErrors(
      fileAnalysis({
        templates: [s1, s2, s3]
      }),
      [["m1", m1]],
      { m1 }
    ),
    [
      { kind: "template_not_in_modules", template: s2, modules: [["m1", m1]] },
      { kind: "template_not_in_modules", template: s3, modules: [["m1", m1]] }
    ]
  );
  t.end();
});

test("it should not complain if templates used in source from other modules are in the resource modules dependencies", t => {
  const m1 = {
    dependencies: ["m2"],
    templates: {
      "Drawer.hogan": "./banana/phone.hogan"
    }
  };
  t.deepEqual(
    getMissingTemplatesErrors(
      fileAnalysis({
        templates: [
          { module: "m1", fileName: "Drawer.hogan" },
          { module: "m2", fileName: "banana.hogan" }
        ]
      }),
      [["m1", m1]],
      {
        m1: m1,
        m2: { templates: { "banana.hogan": "./banana/banana.hogan" } }
      }
    ),
    []
  );
  t.end();
});

test("it should complain if templates used in source from other modules are not in the resource modules", t => {
  const m1 = { templates: { "Drawer.hogan": "./banana/phone.hogan" } };
  t.deepEqual(
    getMissingTemplatesErrors(
      fileAnalysis({
        templates: [
          { module: "m1", fileName: "Drawer.hogan" },
          { module: "m2", fileName: "banana.hogan" }
        ]
      }),
      [["m1", m1]],
      {
        m1: m1
      }
    ),
    [
      {
        kind: "template_not_in_modules",
        template: { module: "m2", fileName: "banana.hogan" },
        modules: [["m1", m1]]
      }
    ]
  );
  t.end();
});

test("it should complain if templates used in source from other modules are not in the dependencies in resource modules", t => {
  const m1 = {
    templates: {
      "Drawer.hogan": "./banana/phone.hogan"
    }
  };
  t.deepEqual(
    getMissingTemplatesErrors(
      fileAnalysis({
        templates: [
          { module: "m1", fileName: "Drawer.hogan" },
          { module: "m2", fileName: "banana.hogan" }
        ]
      }),
      [["m1", m1]],
      {
        m1: m1,
        m2: { templates: { "banana.hogan": "./banana/banana.hogan" } }
      }
    ),
    [
      {
        kind: "template_not_in_dependencies",
        template: { module: "m2", fileName: "banana.hogan" },
        modules: [["m1", m1]]
      }
    ]
  );
  t.end();
});
