The Global Recipe Finder
With just one click, foodies may explore thousands of recipes from around the globe with the browser-based software Global Recipe Finder. The application offers an interactive platform where users can search for meals, explore different categories and nations, and look over today's highlighted recipes using a comprehensive open-source database.

Features
1.	Interactive Navigation Bar: The application features a streamlined navigation menu that includes:
• Home: Returns the user to the main landing page.
• Categories: Allows users to filter recipes by specific food types like dessert, breakfast, etc.
• Countries: Enables browsing of dishes based on their regional or national origin.
• Surprise Me!: A specialized feature that generates a random recipe for instant inspiration.
• Favorites: A dedicated space where users can access their personally saved and organized recipes.

2.	Today's Featured Recipes: A curated section on the homepage that highlights specific meals to help users stay productive and inspired in the kitchen.

3.	Search Functionality: Users can search for dishes by entering meal names or keywords. 


How the Application Works
    Using the Navigation Bar
1.	Select or choose from the Home, Categories, and Countries to browse the database.
2.	Click the Surprise Me! to get or let the application select a random meal for you.
3.	Use the Favorites button to view the meals or recipes that you have saved.

    Searching for Recipes
1.	Input or type in the search box of a dish name.
2.	Click the SEARCH or ENTER button.
3.	Wait for the real-time response as the application fetches the meal data.

Viewing Recipe Details
•	Click the View Full Recipe button on any recipe card to open a detailed modal window.
•	Inside the modal, you can find the complete list of Ingredients with their specific measurements. 
•	Read through the step-by-step Cooking Instructions to prepare the meal. 
•	Click the YouTube link to watch a video tutorial for a better visual guide on how to cook the dish. (Optional)


The API used
TheMealDB API
We integrated TheMealDB, an open, crowd-sourced database of Recipes from around the world. We used several functions of this API to make the app interactive:
•	Key Features Implemented 
-	Search by Name: Fetches specific meals based on user input.
-	Filter by Category & Area: Allows users to browse recipes by food type or by country of origin.
-	Random Recipe: Enable the "Surprise Me!" feature by fetching a random meal from the server.
-	Lookup by ID: Retrieves full recipe details, including measurements and YouTube tutorial links.

Challenges
•	Data Inconsistency 
-	The information from the API did not always follow the same format. Some recipe instructions were in long paragraphs, while others were in lists. We had to create a logic to clean and format this data so it would look neat on our website.

•	Managing Asynchronous Data 
-	Since we are fetching data from an external server, there were times when the response was slow or failed. We had to make sure the app would not crash and that the images would load correctly even with different connection speeds.

•	UI and Layout Alignment 
-	Making the recipe cards and the modal view look consistent was a challenge. We had to adjust the CSS carefully to ensure that the images and text were aligned properly, regardless of how long the recipe name or the ingredient list was.






