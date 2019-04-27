export function write_file_disk(data,json_path,message){
    const fs = require(`fs`);
    fs.writeFile(json_path,JSON.stringify(data,null,4),(err)=>{
       if(err){
           alert(err);
           return;
       } 
        alert(message);
    });
}