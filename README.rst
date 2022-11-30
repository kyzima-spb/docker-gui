docker-gui
==========

**docker-gui** - is the base image for running GUI applications in Docker.

Attention
---------

It's a crazy idea to run GUI applications in Docker containers,
but sometimes there is no other way to run the application on the server
or on the current OS.
The image uses the s6-overlay_ service manager.

.. _s6-overlay: https://github.com/just-containers/s6-overlay
