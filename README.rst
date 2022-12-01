docker-gui
==========

**docker-gui** - is the base image for running GUI applications in Docker.

.. note::

    It's a crazy idea to run GUI applications in Docker containers,
    but sometimes there is no other way to run the application on the server
    or on the current OS.


How to create a new image?
--------------------------

Let's look at an example of creating a new image to run the Chromium browser in Docker.

Create image directory
~~~~~~~~~~~~~~~~~~~~~~

Create a new directory for the image files anywhere and go to it:

.. code-block:: shell

    $ mkdir ~/docker-chromium
    $ cd ~/docker-chromium

Next, create a directory and file structure as shown below:

.. code-block::

    .
    ├── Dockerfile
    └── root
        └── etc
            └── s6-overlay
                └── s6-rc.d
                    ├── chromium
                    │   ├── dependencies
                    │   ├── run
                    │   └── type
                    └── user
                        └── contents.d
                            └── chromium

The image uses the s6-overlay_ service manager.
Therefore, to understand why each directory or file is needed,
it is better to refer to the official documentation.

Create service
~~~~~~~~~~~~~~

The file ``./root/etc/s6-overlay/s6-rc.d/chromium/run``
contains the code to start the service (in the example browser).
It is recommended to use the execline language:

.. code-block:: shell

    #!/command/execlineb -P

    with-contenv

    redirfd -w 2 /dev/null

    chromium --no-sandbox --start-maximized

In the ``./root/etc/s6-overlay/s6-rc.d/chromium/type`` file,
specify the type of service: ``longrun`` - starts at startup, if the service crashes,
it will be restarted (the browser cannot be closed =)

.. code-block::

    longrun

In the ``./root/etc/s6-overlay/s6-rc.d/chromium/dependencies`` file,
specify the dependencies on other services (who should be started first),
one dependency per line:

.. code-block::

    x11vnc

The file ``./root/etc/s6-overlay/s6-rc.d/user/contents.d/chromium`` is empty,
it is a link indicating that this service is enabled and should be started.

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
.. _execline: https://skarnet.org/software/execline/
