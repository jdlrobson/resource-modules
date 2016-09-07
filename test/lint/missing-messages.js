const test = require('tape')

const getMissingMessagesErrors = require('../../lib/lint/missing-messages')

test('won\'t return errors if there are not messages', (t) => {
  t.equal(getMissingMessagesErrors({}), undefined)
  t.equal(getMissingMessagesErrors({messages: []}), undefined)
  t.end()
})

test('it should not complain if messages used in source are in the resource modules', (t) => {
  t.deepEqual(getMissingMessagesErrors({
    messages: ['banana', 'phone']
  }, [
    ['module1', { messages: ['banana', 'phone'] }],
    ['module2', { messages: ['banana', 'phone'] }]
  ]), [])
  t.end()
})

test('it should list by message used in source in which resource modules it is not specified', (t) => {
  const m1 = ['module1', { messages: ['banana', 'phone'] }]
  const m2 = ['module2', { messages: ['phone'] }]
  const m3 = ['module3', { messages: ['banana'] }]
  const m4 = ['module4', { messages: ['phone', 'ring'] }]

  t.deepEqual(getMissingMessagesErrors({
    messages: ['banana', 'phone']
  }, [m1, m2, m3, m4]), [
    ['banana',
      [m2, m4]],
    ['phone', [m3]]
  ])
  t.end()
})

test('it should list properly even when messages is a weird object instead of an array', (t) => {
  const m1 = ['module1', { messages: {'0': 'phone', '1': 'ring', 'banana': function () {}} }]
  t.deepEqual(getMissingMessagesErrors({
    messages: ['banana', 'phone']
  }, [m1]), [
    ['banana', [m1]]
  ])
  t.end()
})
