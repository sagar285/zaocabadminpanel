// let obj ={
//     name:"Bharat",
//     age:23
// }

import { arMA, id } from "date-fns/locale";
import { HelpingHandIcon, Tablet } from "lucide-react";


// console.log("firstttttt",obj.name)
// console.log("second",obj.name,obj.age)

// console.log(obj['age'],obj['name'])


// // console.log(obj[key])




// function Add({a,b}){
//    let c= a+b
//     console.log(c)
   
// }

// console.log(Add(2,6))




let arr = [3,67,76,79,200,4,660,89,88,90]

// const findmax = (array) => {
//     let temp = 0;
//     for (let i = 0; i <= array.length; i++) {
    
//         if (temp<array[i]){

//        temp=array[i]


//         }

            
      
//         }
//   return temp
         
//     }   


// console.log(findmax(arr))





// function findmax(a){
// let temp = 0
// for(let i=0;i<a.length;i++){
    
//     if(temp<arr[i]){
//      temp=arr[i]
//     }
  
// }

//   return temp
    
// }


// console.log(findmax(arr))
















// function getEvenNo(a){

//     let even = []

//     for(let i =0;i<a.length;i++){
//         if(a[i]%2==0){
//             even.push(arr[i])
//         }
//     }
//     return even

// }


// console.log(getEvenNo(arr))


// let Array = [2,1,4,3,6,5,8,7];
// let findeven = (even) => {
//     let temp = []
//     for (let i = 0; i< even.length; i++) {
//          if (even[i]%2==1) {
//              temp.push(even[i])
//          }
       
//     } return temp
// }
// console.log(findeven(Array))







// function getPrimeNo(a){


//     let prime =[]
//     for(let i =0;i<a.length;i++){
//         let num=a[i]

//         if(num<2) continue

//         let isPrime = true
//         for(let j=2;j<num;j++){
//             if(num%j===0){
//                 isPrime=false
//                 break
//             }
//         }
//         if(isPrime){
//             prime.push(num)
            
//         }
//     }
// return prime
    

// }

// console.log(getPrimeNo(arr))



















// function getPrimeNo(a){
//     let prime =[]
  
//     for(let i =0;i<a.length;i++){
//   let num =a[i]
//         // console.log(a[i])
//                 if(num < 2) continue; // 0, 1 prime nahi hote

//         let isPrime = true
//         for(let j=2;j<num;j++){
//             if(num%j===0){

//             isPrime = false;
//             break
//                 // console.log(a[i])
//             }
           
//         }

//          if(isPrime){
//                 prime.push(num)
//             }
        
//     }
//     return prime
// }


// console.log(getPrimeNo(arr))




// arr.map(getPrimeNo)



// function getPrimeNo(a){
//     let prime = []

//     for(let i=0;i<a.length;i++){

//         let num = a[i]
//         if(num<2)continue

//         let isPrime = true

//         for(let j=2;j<num;j++){
//             if(num%j===0){

//                 isPrime=false;
//                 break
//             }
//         }
//         if(isPrime){
//             prime.push(num)
//         }
//     }
//     return prime
// }

// console.log(getPrimeNo(arr))



let data =[5, "hello", {name: "John", age: 25}, 10, "world",1, "hellznnnno", true, {name: "Alice"}, 42,999,22,776,8, "worlzhd", false,]
// const data = [1, "hellznnnno", true, {name: "Alice"}, 42,999,22,776,8, "worlzhd", false, null];



// data.map((item,index)=>{
//     // console.log(item)
//     const itemType =typeof(item)
//     if(itemType == 'string'){
//     //    const itemUpper = itemType.toUpperCase(item)
//         console.log("sjkkkkkkkkkkkkkkk",item.toUpperCase())
//     }

//     if(itemType === 'number'){
//        console.log( item*item)

//     }

//     if(itemType === 'object'){
//         console.log(item)

//        for(let key in item){
//   console.log(`value: ${item[key]}`);
//        }

      
        
//     }

//     return;
// })


//     let result=[]
// //     // nul=0,str=[],bool=[],undo=[],obj=[]

// data.forEach((item)=>{
//    if (item === null || item === undefined) {
//     return;
//   }
    

//   const itemType = typeof item
  
//   if (itemType === "number") {
//     result.push(item * 10);
//   }
//   else if (itemType === "string") {
//     result.push(item.toUpperCase());
//   }
//   else if (itemType === "object") {
//     const str = Object.entries(item)
//       .map(([key, val]) => `${key}=${val}`)
//       .join(" | ");
//     result.push(str);
//   }
//   else if (itemType === "boolean") {
//     result.push(item);
//   }
// });

// console.log(result);







// let str ='dhjhdjhjhjhshh'
// let reversed = ''
// for(let i= str.length-1;i>=0;i--){

//     reversed+=str[i]
// }
// console.log(reversed)





// const data1 = [
//     {
//      name:"Laptop",
//      active:true
//     },

//     {
//         name:"phone",
//         active:false
//     },
//     {
//         Tablet:{
//             name:'new object',
//             active:true
//         }
//     }
// ]



// const getActive = data1.filter((product)=>
// product.active
// )

// console.log(...getActive)


// const getName = data1.filter((product)=>
//     product.name.valueOf === Tablet

// )



// const bharat = [

//     {
//         id:1,
//         name:'Bharat'
//     },
//     {

//         id:23,
//         name:'Sonu'
//     },
//     {

//         id:38,
//         name:"Deva"
//     }
// ]


// const devansh = [
//     {
//      id:1,
//      name:"Sonu"
//     },
//     {
//      id:1,
//      name:"Devansh"
//     },
//     {
//         id:3,
//         name:'Bharat'
//     }

// ]


// const new_arr = bharat.map((item,index)=>item)

// // console.log('sa',new_arr)

// const d_arr = devansh.map((item,index)=>item)

// new_arr.push(...d_arr)


// const result =new_arr.map(findSimilar)
// function findSimilar(item, index, array) {
//   let count = array.filter(s => s.id === item.id).length;


//   if (count > 1) {
//     return {
//       ...item,
//       selected: true  // Sirf similar objects mein selected key
//     };
//   } else {
//     return item;  // Unique objects unchanged
//   }


// }

// console.log("Final Result with Selected Key:", result)
// // console.log("ssjkjssj",new_arr)




const names = ['Ali', 'Ahmed', 'Sara', 'Mohammad'];





  
<button
onClick={saveSeatConfiguration}
disabled={isLoading || !vehicleName.trim()}
className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
{isLoading ? (
  <Loader2 className="w-4 h-4 animate-spin" />
) : (
  <Save className="w-4 h-4" />
)}
{isLoading ? "Saving..." : "Save Complete Configuration"}
</button>



const [a,b,c]

const df = {
  a:{
    input:{
      placeholder:"dfff",
      value:
    },
    selectbar
  },
  b:{

  }
}