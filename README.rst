docker-gui
==========

**docker-gui** - is the base image for running GUI applications in Docker.
The image uses the s6-overlay_ service manager.

.. note::

    It's a crazy idea to run GUI applications in Docker containers,
    but sometimes there is no other way to run the application on the server
    or on the current OS.


How to create a new image?
--------------------------

Image directory
~~~~~~~~~~~~~~~

Create a new directory for the image files anywhere and go to it:

.. code-block:: bash

    $ mkdir ~/docker-chromium
    $ cd ~/docker-chromium

Dockerfile
~~~~~~~~~~

Create a new Dockerfile and install the application
with all required dependencies, for example:

.. code-block:: dockerfile

    FROM kyzimaspb/gui

    # By default, all services run as a normal user
    # To install, you need to switch to superuser
    USER root

    RUN set -x \
        && apt update \
        && apt install -yq --no-install-recommends chromium \
        && apt-get clean  \
        && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

    # Directory containing the description of the service
    COPY ./root /

    # We return the launch as a normal user
    USER user


Build and start
~~~~~~~~~~~~~~~

.. code-block:: bash
    
    docker build -t chromium .
    docker run -d --name gui_demo \
        -p 5900:5900 \
        --shm-size 2g \
        chromium

Forwarded ports:

* ``5900`` - TCP port for connecting VNC clients;


Environment Variables
---------------------

* ``XVFB_RESOLUTION`` - screen resolution of the virtual X server;
* ``VNC_SERVER_PASSWORD`` - the password for the VNC server.


.. _s6-overlay: https://github.com/just-containers/s6-overlay
