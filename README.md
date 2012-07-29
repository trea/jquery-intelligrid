jQuery Intelligrid
==========

This plugin was originally written because I hate having multiple action buttons per row.  The first version of this was less of a plugin and was tailored for use in the PyroCMS admin area. This time around, it's a jQuery plugin, and uses Glyphish/Bootstrap icons (like most everything else, you'll be able to override it if you want).  The goal of Intelligrid is to provide a common action area for table rows in a manner similar to Google Docs/Drive.  It is meant to consume a REST data source (in Codeigniter and/or PyroCMS, I use REST_Controller by Phil Sturgeon).  At first this might be less of an intelligent grid as the name implies, and more of a better way of handling actions, but I do intend to include sorting and pagination very soon.

Features to Include:

- Select All / Select None
- Refresh
	- By default it will just refresh the page, until it is written in a manner to handle AJAX properly.
- Default Actions
	- Add / Edit
		- By default these actions will take you to traditional HTML forms, but they should be easy to override so that you can use modal forms, etc.
	- View
		- Double click an item to view it.  Can be overridden.