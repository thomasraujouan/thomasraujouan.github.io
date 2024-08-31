---
layout: page
title: "Installing XLab"
date: 2023-07-23 08:28:52 +0900
categories: xlab
permalink: xlab/install
hide-nav: true
---

# 1. Install Docker

_[WINDOWS USERS: please backup your data before installing Docker][windows]._

In order to be cross-platform, Xlab has been dockerized. The first step is thus to [install Docker Engine][docker].

Here is how it shoud look like if you are on Debian:

{% highlight bash %}
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
{% endhighlight %}

You can then run a test container:
{% highlight bash %}
sudo docker run --rm hello-world
{% endhighlight %}

[Add sudo privileges to docker][sudo]:
{% highlight bash %}
sudo groupadd docker
sudo usermod -aG docker $USER
{% endhighlight %}

Log out, log in, and check that you can run docker without sudo:
{% highlight bash %}
docker run --rm hello-world
{% endhighlight %}

# 2. Pull the Xlab image

Pull the image from DockerHub:
{% highlight bash %}
docker pull xlabimage/xlab
{% endhighlight %}
It can take a few minutes.

Once it is done, let us rename the image:
{% highlight bash %}
docker image tag xlabimage/xlab xlab
{% endhighlight %}

# 3. Run an Xlab container

Check that you can run an Xlab container:

{% highlight bash %}
docker run -it --rm xlab
{% endhighlight %}

You should now be given a new prompt. It is bash running inside the container.
You can look around
{% highlight shell %}
ls
{% endhighlight %}
and exit the container:
{% highlight shell %}
exit
{% endhighlight %}

# Congratulations!

You can now used Xlab and [compute your first example][example].

[example]: /xlab/example
[docker]: https://docs.docker.com/engine/install/
[windows]: https://github.com/docker/for-win/issues/1549
[sudo]: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
[download]: https://drive.google.com/u/0/uc?id=1GVyO0bixvcIXBdPFdlXunCepdSrl89M4&export=download
