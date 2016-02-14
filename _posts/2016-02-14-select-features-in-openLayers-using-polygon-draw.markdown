---
layout: post
title:  "Selecting features by drawing polygons in openLayers 3"
date:   2016-02-10 22:11:43 +0000
---

I recently started looking at openLayers 3 for research purposes at work. This was my first experience of using a mapping API and I was very impressed. There are loads of examples of what you can achieve with openLayers 3 on the website. I was really surprised by how easy it was to create what I thought would be complex features.

What I want to show is a how to use the ol.interaction.Draw interaction to draw a polygon and select all features within it.

## Step 0: Set up a working environment 

So that you can play along, we will set up this example in a plunker. Starting with a new plunk, open the libraries tab and search for “openlayers”. Add the openLayers 3+ library to your index.html page. This will add something like the following two lines to your html file (I updated my links to use version 3.11.2 here)

One morething to note — I have changed the link to the javascript file to have “ol-debug.js” rather than just “ol.js” — this will give you the un-minified library which will give more useful variable names when debugging.

<script src="https://gist.github.com/dafyddPrys/6909bc60b690159584ae.js"></script>

We also need to add a div to house the map in the html file. Add a div with the id of “map” and the openLayers library will identify it and add the map in there. You can add styling to this element in a css file if you like. The line will look like this:

    <div id=”map”></div>

The html page is all set up now. Nothing will be visible if you run it as we haven’t actually created a map object yet.

## Step 1: Create a map

We will make the most basic map we can for this to get to the meat of the post. We will make a map object and the view property and a layer property (which will be the map tiles). Then we will initialise the map.

In the script.js file of your plunk, add the following:

<script src="https://gist.github.com/dafyddPrys/f6f57a1a09e9682e5567.js"></script>

Some comments on this: the baseLayer and view objects don’t really need to by globally declared. I just separated them out for clarity here. For more information on how to set up a basic openLayers map, read this quick start guide.

Whats going on? Well, we’ve created a new tile layer and set the source as as a new OpenStreetMap source object. Then we’ve created a view object and set a default location and zoom level. We then added this view object as the view for the map object and added the tile layer onto the map as the baseLayer.

If you run this now you should get a map looking at the south of the UK.

## Step 2: Add some features 

So now we have a map. We need some features! With openLayers, you can import features in geoJSON format. To make some sample data, use the geoJSON generator at geojson.io. I used point features in my example and I cannot guarantee that the selection behaviours for other types of features will work with my example, so I recommend using point features only. I also recommend making all of your point features around the UK, unless you like scrolling a lot.

Once you’re done, copy the geoJSON code, create a new file called something like “points.json” in your plunk and paste the copied code into the file.

Next we need to add this new feature data to a layer on the map. So we will make a new layer called points layer. In your script.js file, anywhere above the init function, write the following:

<script src="https://gist.github.com/dafyddPrys/a7faf290b844a2e2751b.js"></script>

So we make a new ol.layer.Vector object and set the source to be an ol.source.Vector object with a url property of the name of our json file. We also specify what format our feature data is in. Finally, we will need to add this layer to the map by adding it in the init function. The updated init function is below:

<script src="https://gist.github.com/dafyddPrys/0f2d33c843643cd9e582.js"></script>

Now when you run the plunk you should be able to see your features appear in the standard styling.

## Step 3: Add functionality to draw polygons 

So we have a layer with our map tiles and we have a layer with our imported point features. We will now make another layer which will hold our drawings and also a vector source object to hold our drawing points.

Under the init(); call, add the new drawing layer and source object:

<script src="https://gist.github.com/dafyddPrys/b5758000b74d3873cd93.js"></script>

Now we need to add the ability to add points to this drawingSource so that they will show up on the map! Under the layer you’ve just added, add the following code:

<script src="https://gist.github.com/dafyddPrys/f7135d821bb5dbc068d8.js"></script>

So to explain: two of the three global variables are not used in this section but we will introduce them here. For the new ol.interaction.Draw object, we have used the drawingSource as the source. This tells the library which object to append the drawing points to. We declare the type property to be a polygon and we tell it to only draw when the Ctrl button is pressed, otherwise it would draw on click. We then add this interaction to the map.

If you run this now, you should be able to draw polygons by holding Ctrl/Cmd and clicking away. The polygon will complete when you click again on the starting point. The standard OL3 styling should be applied and you can see the border and the highlighted area inside the polygon clearly.

## Step 4: Select features inside the polygon 

Now all the open layers functionality is in place! We now need to add the logic so that when a polygon is finished, it goes and checks which points from the pointsLayer are inside the polygon and selects the points if they are.

The ol.interaction.Draw interaction has handy listeners for when drawing starts and end. We will use them both to manage our drawing.

First, we only want to be able to draw one polygon at a time. Therefore we have to clear the previous drawing when we start a new one.

Second, when the drawing is finished, we want to only select the point features that are inside our polygon. To see if they’re in the polygon, we get all the features from the pointsLayer and see if the polygon intersects them. If it does, we add it to an array of features which are selected.

How do we make the selectedFeatures actually selected? For this, we need to add a selection interaction. At the bottom of your script.js file, add the following to declare the selection interaction:

<script src="https://gist.github.com/dafyddPrys/13c5e2e54e7366a88665.js"></script>

By adding this interaction, we can then pull the ol.Collection (a beefed up array) of the selected Features and then add to this programatically.

Next, add the logic for the “drawstart” and “drawend” events:

<script src="https://gist.github.com/dafyddPrys/64414198ed34c069e836.js"></script>

So there’s a few things happening here.

On “draw start”, we clear the current drawing source so any old polygons are deleted. We disable the select interaction because the single click operation gets in the way of our selection functionality when we close the polygon (this will be reactivated later). We also clear any selected features as we’re starting the selection process again

On “draw end”, we reactivate the select interaction after a delay of 300ms. Why? The single click event takes 256ms to occur, so we wait until after that. Otherwise the click of the closing of the polygon will be overwritten by the select interaction, which by default is triggered by a single click. We also clear all selectedFeatures so we can only select the ones inside the new polygon.

Then we cycle through all features on the pointsLayer and check to see if the geometry of our polygon intersects with their “extent”. If they do, the point is in the polygon so we want to select it. Therefore we push it onto the selectedFeatures collection.

And that’s the basics! If you run this now, you should be able to draw a polygon which will select any point features inside of it when completed. Below I will explain some extra functionality that you can add if you want.



[A plunk with the full working code can be found here.](http://embed.plnkr.co/kSFZb9/)








## More features! 

You can always do more. Below I will show the steps to add some functionality, such as updating which points are selected as you draw and being able to modify the polygon after it is created (and updating the selected features as you go)

 ### Updating selected features in real time 
 
 You will notice that as you draw your polygon on the map, a white-faded area is created showing what counts as “inside” the polygon as you draw it. We can update the selection logic so that it updates which point features are selected as you draw. How exiting! This would give the user a better understanding of which features are being selected before they finish the polygon, reducing error rates and frustration.

First, we will globally define a variable called “sketch” which will be our current drawing. Then we will add a listener to the geometry of this drawing, so that when the geometry changes, we will update the selected features. If you have gone through the code above, you will see that the sketch variable has already been defined. We therefore just need to add the listener. The updates to the “draw start” and “draw end” event handlers are shown in bold below:

<script src="https://gist.github.com/dafyddPrys/5037f6f7ed36961ed05c.js"></script>

So we define sketch as the current drawing and then the listener function fires whenever the drawing changes. It cleares the selected features (so that features can be unselected) and checks which features are in the polygon again. We could abstract out the “test and push” functionality here as we’ve used it in a couple of places in an identical fashion. Anyway, running this now should select point features as you draw.

### Modify the drawing and update the features 

It could be useful to allow the user to update their polygon after they’ve finished drawing it to allow for some fine tuning. We can add this functionality.

There is an ol.interaction.Modify interaction which we will add to our map. At the bottom of the script.js file, write:

<script src="https://gist.github.com/dafyddPrys/b399245bfc510d31b13e.js"></script>

We have added a Modify interaction and set the features property to be the source where we keep the current drawing. Now we need to essentially copy the selection logic from the “draw start” and “draw end” events and put it in the event listeners for “modify start” and “modify end”. At the bottom of the script.js file, write:

<script src="https://gist.github.com/dafyddPrys/7c18a97c42b544c9ff80.js"></script>

So we have pretty much exactly copied the logic from the “draw start” and “draw end” event listeners. If you run this now, you should be able to click and drag on a polygon after you’ve drawn it and move the edges and points and so on. The collection of selected point features should update as you go.

## Places where I tripped up 

Interaction.select overriding the“draw end” event I spent an embarrassingly long time being confused as to why my polygon was selecting features for only a fraction of a second. To see what I was experiencing, remove the “select.setActive(false)” and the “delaySelectActivate()” lines from the code and see how annoying it is.

I explained this above, but what was happening was the select interaction that we added was overriding the selection we make when we closed the polygon. Closing the polygon is done with a click and the select interaction uses a single click trigger as default. The browser checks for a single click by waiting 256ms after the click to make sure it is a single click. So what was happening for me was 256ms after closing the polygon, the select event triggered. No point features were being clicked on, so the selectedFeatures collection was emptied.

We now deactivate the click events when we start drawing the polygon and reactivate it 300ms after the polygon is closed. Now it doesn’t mess with our polygon select functionality, but we can still use it if we want to!

Using the polygon’s extent rather than the geometry To start with, when I wanted to check if the point features were inside my polygon, I was using the polygon’s extent via the getExtent() method. It looked something like this:

<script src="https://gist.github.com/dafyddPrys/6d3de7a0bbb91fde9516.js"></script>

This was doing the check the other way around — for each point in the pointsLayer, push the feature to the selectedFeatures collection if it intersects the extent of the event. Going through the API documentation, this seemed to by the was that this kind of check was designed to be done. Unfortunately it didn’t work as I expected.

What was wrong with this? The use of the polygon’s extent. The extent of any feature is four coordinates which create an oblong which contains all parts of a feature. This was no good if we wanted an irregularly shaped or pointy polygon with weird little complicated bits in it. Therefore I changed it to compare the geometry of the polygon (which used all points) and check if it intersected the extent of each point feature. This works for points because their extents are just repetitions of the same coordinates four times, meaning you really are just testing the intersection against a point.

The result was a check like this:

<script src="https://gist.github.com/dafyddPrys/456a0fe83f80a57a3a13.js"></script>

As I mentioned before, a working plunker of all this is available here.

Thanks for reading!