---
layout: post
title: "Sharing directories"
date: 2023-08-14 07:28:52 +0900
categories: xlab
permalink: xlab/share
---

The docker container and the host machine can share directories, allowing you to bring your experiments home.
This post is a continuation of [this one][catenoid], where we computed our first example with xlab.

1. Make an xlab directory and go to it:

{% highlight bash %}
mkdir xlab
cd xlab/
{% endhighlight %}

{:start="2"}

2. We want to take a picture of a surface using XLab and bring it on the host machine, outside the container. So make a directory for sharing files between the host and the container:

{% highlight bash %}
mkdir shared
{% endhighlight %}

{:start="3"}

3. Open acces to X:

{% highlight bash %}
xhost +local:
{% endhighlight %}

{:start="4"}

4. Run an xlab container with the shared directory mounted. You should replace ABSOLUTE-PATH-TO-SHARED by the absolute path to the shared directory of step 2.

{% highlight bash %}
docker run -it --rm \
--volume=/tmp/.X11-unix:/tmp/.X11-unix \
--device=/dev/dri/card0:/dev/dri/card0 \
--env "DISPLAY=$DISPLAY" \
--network="host" \
--volume=ABSOLUTE-PATH-TO-SHARED:/shared xlab
{% endhighlight %}

{:start="5"}

5. Compute an example (as explained in [the previous post][catenoid]).

6. Find your favorite point of view with the mouse in the XLab \| Viewer window. You can use the Space key to center the view and the "o" key to go back to the default view. Fullscreen with "f", switch viewers with "r".

7. In the XLab window, right click on the node called "ViewerR3" and select "Open". Maximize your window if necessary.
   Click on the "Scene" node. Expand the left-hand panel if necessary to select "Controls". Then click on the button right beside "Screenshot".
   Write

{% highlight bash %}
/shared/my-picture.png
{% endhighlight %}

and press Enter.
Close the XLab windows and exit the container. Don't forget to close access to X with

{% highlight bash %}
xhost -local:
{% endhighlight %}

{:start="8"}

8. Open shared/my-picture.png. Congratulations, you brought your picture home. Now you can [save your experiments][save].

[catenoid]: {% post_url 2023-08-12-xlab-first-example %}
[save]: {% post_url 2023-08-15-xlab-read %}
