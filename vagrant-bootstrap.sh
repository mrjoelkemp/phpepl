#!/bin/bash
# simple provisioning for php and apache

sudo apt-get -y install apache2 php5
# fix the docroot
sudo sed -i 's/\/var\/www\/html/\/var\/www\/public/g' /etc/apache2/sites-enabled/000-default.conf
sudo service apache2 restart