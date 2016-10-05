function trace(v){
	console.log(v);
}
function array_putin(base, put_id, item){
	var len=base.length;
	base.push(base[len-1]);
	for(i=put_id; i<len-1; i++)
		base[i+1]=base[i];

	base[put_id]=item;
	
	return base;
}
function isNumber(x){ 
    if( typeof(x) != 'number' && typeof(x) != 'string' )
        return false;
    else 
        return (x == parseFloat(x) && isFinite(x));
}