FROM kyzimaspb/bullseye-slim

USER root

RUN set -x \
    && apt update \
    && apt install -yq --no-install-recommends chromium \
    && apt-get clean  \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY ./root /

USER user
