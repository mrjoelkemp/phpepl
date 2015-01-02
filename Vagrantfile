# set up a Vagrantbox to run the repl
# check it out at http://phpepl.dev after running 'vagrant up'

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  # Remove the default Vagrant directory sync
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.synced_folder "./", "/var/www/public", id: "vagrant-root",
    owner: "vagrant",
    group: "www-data",
    mount_options: ["dmode=775,fmode=664"]

  config.vm.network :private_network, ip: "192.168.56.101"
  config.ssh.forward_agent = true

  # host dns registration
  # you'll need "vagrant plugin install vagrant-hostsupdater" for the site name to be added to your hosts resolver file automatically
  config.vm.hostname = "phpepl.dev"
  if Vagrant.has_plugin?("vagrant-hostsupdater")
    config.hostsupdater.remove_on_suspend = true
  end

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--memory", 512]
  end

  # install apache and php
  config.vm.provision :shell, :path => "vagrant-bootstrap.sh"
end
