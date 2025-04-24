-0.5: No submission on canvas
-0.5: 15 min late release on github

-1.5: You've only shown one table with 1000 rows inserted, need to show at least 3.
We had already shown over 1000 rows for 5 tables in the original submission so we would like to get all 1.5 points back. 
I ran the count queries again for clarity, but there are now more rows because of additional entries from running our application.

-2: In advanced query 2 for example, you attempt to index on the primary key of MoodHealth. The primary key is already an index so the indices that include the primary key are invalid.
We changed the indexing strategies for advanced query 2 to not include the primary key in the indexing. The actual results do not differ by much, but logically they would change the efficiency.

-1: Advanced query 4's subquery seems unnecessary. If the goal is to find the 100 songs closest to the users mood, why are we filtering out some songs based on some test user?
We completely rewrote advanced query 4. The purpose is now to find the top 10 songs closest to the users average mood over the last 7 days.
Subsequently, new index strategies were tested, and analyzed.
