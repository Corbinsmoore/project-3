# Most Popular Names Project
Jacob Dolinsky, Joseph Devito, Corbin Moore

For our project we want to use the number of social security applicants per year dataset (https://console.cloud.google.com/bigquery?project=composed-setup-386914&ws=!1m5!1m4!4m3!1sbigquery-public-data!2susa_names!3susa_1910_current) -  to generate bar graphs, a choropleth map, and line graph?.  All data are from a 100% sample of records on Social Security card applications as of the end of February 2015.  
To safeguard privacy, the Social Security Administration restricts names to those with at least 5 occurrences. 
The purpose of this project is to analyze social security applicant data and display trends in the popularity of preselected names, along with the top ten most poular names.

The bar graphs will tell us the top ten most popular names, by year, based on the numher of social security applicants. simply select a year and hit "show me names"!

A choropleth map was creeated to allow users to see the popularity of certain names, per state. The deeper the hue on the map, the higher the concentration of that name. 

An interactive line graph was also created to show general popularity trends for the names of our group members. You can choose to look at all three names together or focus on 1 of the 3- to get a more in-depth look at the data. you can hover over the graph and it will tell you the number of social security applicants with one of our names for any period of time on the dataset. 

THe project posesses a flask backend with interactive api routes, html menus and a dropdown. 

methods: html/css, javascript. python, sqlite, jupyter notebook and json

Sources: TA Erin helped create the chloropleth map with us and past assignments were referenced (i.e gree gods assignment) for the bar graph.
