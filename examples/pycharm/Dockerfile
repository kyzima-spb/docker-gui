ARG RELEASE="trixie-slim"

FROM debian:$RELEASE AS download

WORKDIR /pycharm

ARG PYCHARM_VERSION="2024.2.2"
ARG PYCHARM_BASE_URL="https://download.jetbrains.com/python"

ADD ${PYCHARM_BASE_URL}/pycharm-professional-${PYCHARM_VERSION}.tar.gz /tmp/pycharm.tar.gz

RUN tar --strip-components=1 -xzf /tmp/pycharm.tar.gz


FROM kyzimaspb/gui:$RELEASE

COPY --from=download /pycharm /opt/pycharm
COPY ./ /
