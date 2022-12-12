function createElemWithText( h1 = "p" , x = "", className){

 const e = document.createElement(h1);
 e.textContent = x;  
  
 if(className){
   e.className = className; 
 }
  
 return e;

}


function createSelectOptions(data){
  if (!data){
    return undefined;
  }
  
  return data.map(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    
    return option;
    
  });
 
}
createSelectOptions();


function toggleCommentSection(postId){
  if(!postId){
    return undefined;
  }
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  

  
 if (section){
  section.classList.toggle('hide');
 }
  
  return section;
}


function toggleCommentButton (postId) {
  if (!postId) {
    return;
  }
  const button = document.querySelector(`button[data-post-id = "${postId}"`);

  if (!button){
    return null;
  }
  if (button != null) {
    button.textContent === "Show Comments" ? (button.textContent = "Hide Comments") : (button.textContent = "Show Comments");
  }
  
  return button;
};


function deleteChildElements(parentElement) {
  
  if(!parentElement?.tagName){
    return;
  }
  
  let child = parentElement.lastElementChild;

  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }

  return parentElement;
} 

function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
        
  buttons.forEach(button => {
    const postId = button.dataset.postId;
    button.addEventListener('click', () => {
      toggleComments(event, postId);
      });
    });
    
  return buttons; 
}
function toggleComments(event,postId){
  if(!event && !postId){
    return undefined;
  }
  event.target.listener = true;
  
  const section = toggleCommentSection(postId);
  
  const button = toggleCommentButton(postId);
  
  const array = [section,button];
  
  return array;
}

function removeButtonListeners(){
  const buttons = document.querySelectorAll("main button");
  
  buttons.forEach( button => {
    const postId = button.dataset.id;
    
    button.removeEventListener('click',() => {
      toggleComments(event,postId);
    });
  });
  return buttons;
}


function createComments(comments){
  if(!comments){
    return undefined;
  }
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < comments.length; i++){
    
    const article = document.createElement('article');
    let h3 = createElemWithText('h3', comments[i].name);
    let p1 = createElemWithText('p', comments[i].body);
    let p2 = createElemWithText('p', `From: ${comments[i].email}`);
    
    article.append(h3);
    article.append(p1);
    article.append(p2);
    
    fragment.append(article);
  }
  
  return fragment;
  
}

function populateSelectMenu(users){
  if(!users){
    return undefined;
  }
  const selectMenu = document.getElementById("selectMenu");
  
  const options = createSelectOptions(users);
  
  for(var i = 0; i < options.length; i++){
    let option = options[i];
    selectMenu.append(option);
  }
  
  return selectMenu;
}


const getUsers = async() => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const jsonUserData = await response.json();
  
  return jsonUserData;
}

const getUserPosts = async(userId) =>{
  if (!userId) 
    return undefined;

  let response;
  
  try{
    response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
  }
  catch{
   
  }
  
  const jsonUserID = response.json();
  return jsonUserID;
}

const getUser = async(userId) =>{
  if (!userId) 
    return undefined;

  let response;
  
  try{
    response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  }
  catch{
   
  }
  
  const jsonUserID = response.json();
  return jsonUserID;
}

const getPostComments = async(postId) =>{
  if (!postId) 
    return undefined;

  let response;
  
  try{
    response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  }
  catch{
   
  }
  
  const jsonUserID = response.json();
  return jsonUserID;
}

const displayComments = async(postId)=>{
  if(!postId){
    return undefined;
  }
  const section = document.createElement("section");
  section.dataset.postId = postId;
  
  
  section.classList.add("comments", "hide");
  
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  
  section.append(fragment);
  
  return section;
}

const createPosts= async(posts)=>{
  if(!posts){
    return undefined;
  }
  
  const fragment = document.createDocumentFragment();
  
  for (const post of posts){
    
    const article = document.createElement('article');
    
    const h2 = createElemWithText('h2', post.title);
    const p1 = createElemWithText('p', post.body);
    const p2 = createElemWithText('p',`Post ID: ${post.id}`);
    
    const author = await getUser(post.userId);
    
    const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
    const p4 = createElemWithText('p', author.company.catchPhrase);
    
    const button = createElemWithText('button', 'Show Comments');
    button.dataset.postId = post.id;
    
    article.append(h2);
    article.append(p1);
    article.append(p2);
    article.append(p3);
    article.append(p4);
    article.append(button);
    
    const section = await displayComments(post.id);
    article.append(section);
    fragment.append(article);
  }
  
  return fragment;
      
}

const displayPosts= async(posts) => {
  
  const main = document.querySelector('main');
  
  let element;
  
  if(posts){
    element = await createPosts(posts);
  }
  if(!posts){
    return document.querySelector('main p');
  }
  main.append(element);
  
  return element;
}

const refreshPosts = async(posts) => {
  if(!posts){
    return undefined;
  }
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector('main'));
  
  const fragment = await displayPosts(posts);
  
  const addButtons = addButtonListeners();
  
  const arr = [removeButtons, main, fragment, addButtons];
  
  return arr;
}

const selectMenuChangeEventHandler = async(event) =>{
  if(!event){
    return undefined;
  }
  
  const userId = event?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  
  const arr = [userId, posts, refreshPostsArray];
  
  return arr;
  
}

const initPage = async() => {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  
  const arr = [users,select];
  
  return arr;
}

function initApp(){
  initPage();
  const menu = document.getElementById('selectMenu');
  menu.addEventListener('change',selectMenuChangeEventHandler, false);
  
}
document.addEventListener('DOMContentLoaded',initApp, false);
