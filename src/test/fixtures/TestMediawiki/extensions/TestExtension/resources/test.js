mw.template = { get: function () {} }
mw.msg = function () {}

// Template usage with non-string literals
mw.template.get( someRandomVariable )

// mw.msg usage with non-string literals
mw.msg( someRandomVariable )

mw.msg( 'message0' )
// Message not declared on ResourceModules
mw.msg( 'message1' )
