# Official Centos Base Image (https://hub.docker.com/_/centos/)
FROM centos:centos7

ENV       S3_AWS_BUCKET           https://s3.amazonaws.com/cnbc-devops
ARG       SPLUNK_FORWARDER
ARG       APP_NAME

# Create Non-Root User
RUN useradd --user-group --create-home --shell /bin/false cnbc

# Create App Directory
RUN mkdir phoenixQl
WORKDIR /phoenixQl
COPY . /phoenixQl

#Install rpms
RUN yum -y install bzip2 fontconfig git wget \
    && curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - \
    && yum -y install nodejs-8.11.2-1nodesource.x86_64 

RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo |  tee /etc/yum.repos.d/yarn.repo

  COPY config/epel.repo /etc/yum.repos.d/epel.repo
  COPY config/RPM-GPG-KEY-EPEL-7  /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
  RUN yum -y install glibc.i686 libstdc++ libstdc++.so.6  
  RUN yum -y install yarn 

# Install Dependencies
RUN npm install --no-optional

# Run Test Suite
# RUN npm run test

# Run Build
RUN NODE_ENV=production npm run build

# Open Port(s)
EXPOSE 3000

# Store log files in an anonymous volume.
VOLUME /phoenixQl/log

# Install and configure Splunk Forwarder
RUN cd /etc/yum.repos.d/ \
    && wget "${S3_AWS_BUCKET}/applications/stage/cnbc-epel.repo"


#RUN yum install -y newrelic-infra
RUN yum install -y splunkforwarder


RUN chown splunk.splunk -R /opt/splunkforwarder

RUN /opt/splunkforwarder/bin/splunk enable boot-start --answer-yes --no-prompt --accept-license


COPY config/splunk-inputs.conf /opt/splunkforwarder/etc/system/local/inputs.conf
COPY config/splunk-outputs.conf /opt/splunkforwarder/etc/system/local/outputs.conf
COPY scripts/start.sh /opt/start.sh

RUN chmod 775 /opt/start.sh
RUN chmod 777 -R /phoenixQl/log

RUN sed -i "s/{{APP_NAME}}/${APP_NAME}/g" /opt/splunkforwarder/etc/system/local/inputs.conf
RUN sed -i "s/{{SPLUNK_FORWARDER}}/${SPLUNK_FORWARDER}/g" /opt/splunkforwarder/etc/system/local/outputs.conf

#Cleanup
#RUN rpm -e install bzip2 fontconfig git wget

# Docker Run Entry
CMD  ["/opt/start.sh"]
