'use strict';

define(function() {
    return [
        {
            element: ".ide .tree",
            position: 'right',
            intro: "Use the file browser to open files instantly"
        },
        {
            element: ".ide .editor",
            position: 'left',
            intro: "Use the editor pane to edit code. It supports:" +
                    "<ol>" +
                    "<li>Multiple Tabs</li>" +
                    "<li>Syntax Highlighting</li>" +
                    "<li>Search and Replace</li>" +
                    "</ol>"
        },
        {
            element: ".ide .terminal",
            position: 'top',
            intro: "Use the terminal window to execute commands"
        },
        {
            element: ".ide [name=refresh]",
            position: 'bottom',
            intro: "Use the refresh button to refresh the directory listing"
        }
    ];
});