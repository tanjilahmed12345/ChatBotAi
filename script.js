let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imageBtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageInput = document.querySelector("#image input");
let submitBtn = document.querySelector("#submit");

// Url clone from Gemini Text Generation Api key
const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDmpgzDC9CXunkwomrLi2JMGU5jOotIqxE" 

let user = {
    message: null,
    file:{
        mime_type:null,
        data: null
    } 
}


// Ai chat Bot response for User text
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let RequestOption = {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{"text":user.message},(user.file.data?[{"inline_data": user.file}] : [])
                ]
            }]
        })
    }
    try{
        let response = await fetch(Api_url ,  RequestOption); 
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML = apiResponse; 
    }catch(error){
        console.log(error);
    }finally{
         // for Auto Scrolling the text 
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});
        image.src= `img.svg`
        image.classList.remove("prompt-img");
        user.file= {}
    }
}


// It will create a chatbox for both ai and user
function createChatBox(html , classes){
    let div = document.createElement("div");
    div.innerHTML = html ;
    div.classList.add(classes);
    return div;
}


// This function handle the chat response for both user and AI 
function handleChatResponse(userMessage){
    user.message = userMessage;
    // This is for User Text Response
    let html = `<img src="user.jpg" alt="" id="userImage" width="7%">
            <div class="user-chat-area">
                ${user.message}
                ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="choose-img" />` : ""}
            </div>`
    prompt.value="";
    let userChatBox = createChatBox(html , "user-chat-box");
    chatContainer.appendChild(userChatBox);
    // for Auto Scrolling the text
    chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"})

    // This is For Bot Response
    setTimeout(()=>{
        let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area"> 
                <img src="loading.webp" alt="" class="load" width="50px"> 
            </div>`
        let aiChatBox = createChatBox(html , "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    },600)
}


// When User Press The Enter KeyboardEvent
prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter" && !e.key=="Shift"){
        handleChatResponse(prompt.value);
    }
});

submitBtn.addEventListener("click" , ()=>{
    handleChatResponse(prompt.value);
})

imageInput.addEventListener("change",()=>{
    const file = imageInput.files[0];
    if(!file) return;
    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64String = e.target.result.split(",")[1];
        user.file={
            mime_type: file.type,
            data: base64String
        }    
        image.src= `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("prompt-img");
    }
    reader.readAsDataURL(file);
})

imageBtn.addEventListener("click",() =>{
    imageBtn.querySelector("input").click()
})