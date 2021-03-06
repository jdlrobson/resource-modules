mw.template = { get: function() {} };
mw.msg = function() {};

// Template with a string literal
mw.template.get('module1', 'template');
// Template usage with non-string literals
mw.template.get(someRandomVariable, anotherRandomVariable);

// Message properly declared
mw.msg('message0');
// mw.msg usage with non-string literals
mw.msg(someRandomVariable);
// Message not declared on ResourceModules
mw.msg('message1');

mw.mobileFrontend.require(ohSoDynamicRequire);
mw.mobileFrontend.require('mf-define-in-module-previous-script');
mw.mobileFrontend.require('mf-define-in-dependency-module');
mw.mobileFrontend.require('mf-define-not-in-dependencies');
mw.mobileFrontend.require('mf-define-in-multiple-dependencies');
mw.mobileFrontend.require('mf-define-nowhere');

mw.mobileFrontend.define(ohSoDynamicRequire, 1);
mw.mobileFrontend.define('mf-define-unused', 1);

test(mw.defineInModulePreviousScript);
test(mw.define.InDependencyModule);
test(mw.defineNotInDependencies);
test(mw.defineNowhere);

// Test for nested opaque objects that shouldn't generate a warning when used
// if a parent namespace is assigned before hand
mw.namespace = {
  opaqueObject: new Object()
};
mw.namespace.opaqueObject2 = new Object();
test(mw.namespace.opaqueObject.get());
test(mw.namespace.opaqueObject2.get());

// Test disabled line doesn't get parsed
mw.message('non-existing-message-i-want-to-ignore'); // resource-modules-disable-line
