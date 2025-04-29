# Stage 4: Mood Diary App
4/28/2025

Team049-WeDeLiver

Megan Tang, Sydney Yu, Yu-Liang Lin, Bo-Syuan Hou


- Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).

  No, the direction of the project remains the same as the original proposal in stage 1. Our goal was to develop a mood analysing application that could generate song suggestions for users according to their mood on a daily basis. As a result, our application now has the ability to analyze user mood through text description and generate songs accordingly. Also, by maintaining a well structured database system, users could easily view past playlists on our application.


- Discuss what you think your application achieved or failed to achieve regarding its usefulness.

  We successfully completed the main functionality proposed at the beginning of the project — suggesting playlists based on users’ mood scores and dynamically updating the playlist when users update their mood. In addition to achieving this core functionality, we also added features to significantly improve the user experience. We integrated an embedded music player, allowing users to listen to songs directly within our app without needing to search for them externally. Furthermore, we incorporated a chatbot to help users accurately determine their mood scores based on their daily text descriptions. Together, these enhancements elevate our project from a basic course assignment to a prototype that closely resembles a real-world application.


- Discuss if you changed the schema or source of the data for your application.

  We made changes to our original schema. In the User table, we added a country column to allow for the implementation of global and local leaderboards. This allows users to see how they are ranked in their own country and globally. Additionally, in the Song table, we added a track_id column that corresponds directly to Spotify’s track ID. This change can integrate the Spotify Web API which allows the user to play songs directly within our app without having to search for the song manually. We didn’t change the source of the data. 
Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 
Looking back and comparing the final database schema with the original ER diagram, there are two main differences. First, the track_ID attribute in the song table. This attribute was added to our design during stage 4. We didn’t include this attribute at the beginning because we had another defined attribute ID that could serve as the primary key for the song table, and thus we thought it would be redundant to include another ID attribute. However, during the implementation of stage 4, we found that the track_ID attribute could be used to send API requests to spotify and render a better visualization result for playlists in our application. Therefore, we included this attribute to the final schema design. Second, the country attribute in the user table. In the proposal we stated that we would implement both local and global two leaderboards. During the implementation we found that in order to maintain a local leaderboard, we would have to keep track of geographical locations of individual users. Which is why we decided to add the country attribute to the database design at the end.


- Discuss what functionalities you added or removed. Why?

  We did not remove any functionalities from our original proposal. Instead, we added new features to improve the user experience. By embedding a music player, users can now listen to songs directly in the app, making the playlist exploration process smoother and more convenient. The addition of a chatbot for mood analysis allows users to express their feelings in natural language and receive more accurate playlist suggestions. We make these changes because they make the app more interactive, personalized, and enjoyable for users.


- Explain how you think your advanced database programs complement your application.

  First, we create a trigger new_update_consecutive_days that automatically updates a user's consecutive login days whenever a new mood entry is inserted into the MoodHealth table. This ensures the leaderboard remains accurate in real time without requiring manual backend updates. Second, we developed two stored procedures to support playlist generation and mood analysis. The RecommendSongs procedure creates a new personalized playlist by selecting songs based on the user’s recent seven mood entries, using a distance-based calculation from song features like Loudness, Energy, and Valence. Additionally, we created a GetWeeklyMoodAverages stored procedure that calculates a user's average stress, anxiety, sleep, and mood scores over their latest seven records, and also returns a mood interpretation. Furthermore, we create two group by transaction that calculate users ranking based on their consecutive login days and playlist generation, both globally and within each user's country. In addition, we implement another two group by: one query finds the song that appears most often across all user playlists, and another query recommends songs by calculating the distance between a user's average mood scores and song attributes. These group by support the features like music recommendation and playlist analytics within our application. To ensure data integrity and enforce business rules, we defined several important constraints in our database schema. We used primary keys on most of our tables to guarantee the uniqueness of each record. We also used foreign keys with ON DELETE CASCADE actions to maintain referential integrity between related tables. For example, deleting a user automatically deletes all their associated mood entries and playlists. Additionally, the composite primary key on MoodHealth (UserID, Date) prevents a user from recording multiple moods for the same day.
- Each team member should describe one technical challenge that the team encountered. This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project.

  (Megan Tang) One technical challenge I encountered was uploading our cleaned CSV file—containing over 600,000 rows—into the GCP database system. Initially, I attempted to upload the entire dataset at once, but the process was extremely slow, taking over 8 hours to upload just half the data. This was not only inefficient but also risky, since any interruption would mean starting over from the beginning. To solve this, I decided to split the dataset into four equal parts and have each teammate upload a portion of the data in parallel. This approach significantly reduced upload time and increased robustness by isolating potential failures to smaller, more manageable chunks. For future teams working with large datasets, I recommend parallelizing the upload process and planning for failure recovery to save time and reduce frustration.

  (Sydney Yu) The challenge that I encountered while building this project was integrating the Mantine component library into our React frontend. Although we successfully installed @mantine/core and imported individual components such as <Container> and <Button>, we found that the components appeared completely unstyled when rendered. Despite numerous attempts to troubleshoot, including rechecking import paths and verifying component usage, the issue persisted and made the application look broken. After considerable time spent investigating, we realized that Mantine requires a global CSS file to be manually imported — specifically, import '@mantine/core/styles.css';. Without this import, the components do not load their associated styles, even if they function correctly. This experience highlighted for me the importance of closely reading a library’s setup instructions and making sure that all necessary global dependencies are configured properly at the start of development.

  (Bo-Syuan) One of the main challenges I encountered while building this project was formatting the input data. Although we sourced our data from existing tables on Kaggle, we found many entries to be erroneous and unsuitable for direct import into our designed schema. For instance, the presence of duplicate entries led to primary key collisions and conflicts during the data import process. Additionally, the dataset included song titles from around the world, some of which contained invalid characters that were incompatible with UTF-8 encoding. These issues made the data import stage both tedious and troublesome, reinforcing for me the critical importance of data cleaning and preprocessing when developing a database from raw data.

  (Yu-Liang Lin) One of the challenges I encountered during the project was realizing that our original database schema lacked a trackID field for each song. Initially, we designed our schema to store basic song metadata without considering external integrations. However, during development, I discovered a Spotify iframe component that could embed an interactive music player, provided that we had each song’s Spotify trackID. This prompted me to re-examine our schema and recognize the need to store this additional field. To accommodate the change, I updated our data model to include a trackID column and revised our data cleaning pipeline to extract and insert this information. I then batch-uploaded the newly cleaned dataset into our database. This experience highlighted the importance of designing database schemas with potential future features and integrations in mind, even if they are not immediately required at the start of development.


- Are there other things that changed comparing the final application with the original proposal?

  There are three functions that we added which were not mentioned in the proposal, the spotify API, and enabling users to adjust mood scores generated from text.

  Spotify API: By embedding the spotify API in our application. The users would be able to play and add the generated playlist directly on their spotify music player. Also , the API generates visualization support and short demo plays of the requested songs, enriching the front end functions of our project.

  Mood adjustments: In our original proposal we stated that a LLM model could be used to analyze user mood prompting the users to describe their day through words. However, we find that sometimes these predictions may be inaccurate, therefore, we added a survey for users to manually adjust their predicted mood after the LLM analysis. Then we would generate the final playlist accordingly to best fit the users current mood.


- Describe future work that you think, other than the interface, that the application can improve on

  Aside from improving the interface, there are several areas where the application could be further enhanced.

  First, since we expect many users to access the app through mobile devices, we should optimize the layout to be more mobile-friendly to ensure a smoother and more accessible experience.

  Second, we should strengthen the login and authentication system. Ideally, we would allow users to log in using their Spotify accounts, which would not only enhance security but also allow us to fully integrate Spotify’s API and provide a more seamless and personalized service.

  Finally, we could improve the recommendation algorithm to better predict and adapt to users’ musical preferences, making the suggested playlists even more accurate and tailored.

- Describe the final division of labor and how well you managed teamwork.

  We divided the work based on each team member’s strengths to ensure efficiency and balance. Megan Tang and Bo-Syuan Hou primarily focused on the frontend development, working on the user interface design, mood input forms, playlist displays, and leaderboard pages. Yu-Liang Lin and Sydney Yu focused on the backend development, including setting up the Express server, writing API routes, managing database connections, and implementing stored procedures, triggers, and advanced SQL queries. All team members collaborated on the initial database schema design, table creation, and indexing strategies. Overall, our teamwork was effective and well-coordinated. We set clear deadlines, communicated regularly through group chats and meetings, and divided tasks evenly, which helped us stay on schedule and resolve any issues quickly. Each member contributed significantly to their assigned areas, and we successfully integrated the frontend, backend, and database components into a fully functioning application.

