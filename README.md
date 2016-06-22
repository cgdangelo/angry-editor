# Angry Editor
Web-based editor for the "AngryAssignments" World of Warcraft addon.

### What is Angry Assignments?
[Angry Assignments (AA)](http://mods.curse.com/addons/wow/angry-assignments) is an amazing addon, and is almost always a requirement for for Mythic raiding. It allows raid leaders to effectively communicate tasks, roles, strategies, interrupt orders, positioning and more.

The one gripe I had with the addon was that creating pages was a very tedious, iterative process. There was no way to immediately see what the page would look like without saving it, and "sending" it to myself. At times I also found myself constructing pages on my laptop in a text editor and basically _hoping_ that I got the syntax right.

### What is Angry Editor?
Angry Editor is a simple web application that provides a kind of WYSIWYG interface for creating AA pages. My hope is that this allows pages to be more maintainable for users.

#### Features
- [x] Converting to AA format
- [x] Displaying icons inline
- [x] Common/shorthand icons toolbar
- [x] Icon search by name
- [ ] Icon search by ability
- [ ] Parsing AA tokens "on the fly" in edit mode to icons
- [ ] Multi-document support in `localStorage`
- [ ] Page templates, prefabs
