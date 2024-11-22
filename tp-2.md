//MYRIAM BENMOUFFOK

//TP2  

1) 
requete : GET https://jsonplaceholder.typicode.com/comments

2) 
requete : POST https://jsonplaceholder.typicode.com/todos

    parametres (dans x-www-form-urlencoded) : 
userId : 1 
title : nouvelle todo 
completed: false

3) 
requete : PATCH https://jsonplaceholder.typicode.com/posts/1

Dans body > raw : 
{
  "title": "changement de titre",
  "body": "changement de body"
}

4) requete : GET https://jsonplaceholder.typicode.com/posts/1/comments

5) requete : GET https://jsonplaceholder.typicode.com/albums/2/photos
