const data={
shirt:["shirt1","shirt2","shirt3","shirt4","shirt5"],
tshirt:["tshirt1","tshirt2","tshirt3","tshirt4","tshirt5"],
jeans:["jeans1","jeans2","jeans3","jeans4","jeans5"],
cap:["cap1","cap2","cap3","cap4","cap5"],
goggles:["goggles1","goggles2","goggles3","goggles4","goggles5"],
shoe:["shoe1","shoe2","shoe3","shoe4","shoe5"]
};

setTimeout(()=>{
document.getElementById("loader").style.display="none";

let q=new URLSearchParams(location.search).get("q").toLowerCase();
document.getElementById("title").innerText="Results for "+q;

let arr=data[q]||[];

arr.forEach(i=>{
let img=document.createElement("img");
img.src="images/"+i+".jpeg";
results.appendChild(img);
});

},2000);