const addZeros = (number)=>{
    let stringNumber = ""+number
    while(stringNumber.length<3){
        stringNumber = "0"+stringNumber
    }
    return stringNumber
}

export default addZeros