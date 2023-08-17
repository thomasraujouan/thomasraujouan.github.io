---
layout: post
title: "Compute an example"
date: 2023-08-12 08:28:52 +0900
categories: xlab
permalink: xlab/catenoid
---

We compute our first example with xlab: a catenoid.
This post is a continuation of [this one][install], where we installed the xlab container.

1. Open acces to X:

{% highlight bash %}
xhost +local:
{% endhighlight %}
Remember to close the access when you are done with xlab.

<!-- Omitting the following line will cause to start the ordering back from 0 -->

{:start="2"}

2. Run an xlab container:

{% highlight bash %}
docker run -it --rm --volume=/tmp/.X11-unix:/tmp/.X11-unix --device=/dev/dri/card0:/dev/dri/card0 --env "DISPLAY=$DISPLAY" --network="host" xlab
{% endhighlight %}

{:start="3"}

3. Inside the container, compute an example:

{% highlight bash %}
xlab --compute --gui=gtk xlab/experiments/minimal/catenoid.xlab
{% endhighlight %}

{:start="4"}

4. Have fun. You cannot break the container from within.

5. Close the XLab windows and exit the container:

{% highlight bash %}
exit
{% endhighlight %}

{:start="6"}

6. Close access to X:

{% highlight bash %}
xhost -local:
{% endhighlight %}

Now you may want to [export your experiments][share].

[install]: /xlab/install

[share]: {% post_url 2023-08-14-xlab-share %}
