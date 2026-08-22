import React,{useEffect,useRef,useState}from"react";
import{Menu,RotateCcw,X,Save,Trash2,Plus,Info,MapPin,Upload,Eye}from"lucide-react";

const API="https://goldbackend-production-eaef.up.railway.app";

const GoldProductsDashboard=()=>{
const initialFormState={product_id:"",product_name:"",category_name:"",purity:"",weight:"",offer_price:"",original_price:"",stock_quantity:"",product_place:"",product_description:"",product_images:[],imagePreviews:[],state:"",district:"",mandal:"",pincode:""};
const[products,setProducts]=useState([]);
const[showAddForm,setShowAddForm]=useState(false);
const[selectedProduct,setSelectedProduct]=useState(null);
const[showViewModal,setShowViewModal]=useState(false);
const[isLoading,setIsLoading]=useState(false);
const[purityFilter,setPurityFilter]=useState("All");
const[categoryFilter,setCategoryFilter]=useState("All");
const[formData,setFormData]=useState(initialFormState);
const fileInputRef=useRef(null);

const fetchProducts=async()=>{
setIsLoading(true);
try{
const res=await fetch(`${API}/products/all`);
const data=await res.json();
setProducts(Array.isArray(data)?data:(data.products||[]));
}catch(err){console.error(err);setProducts([]);}
finally{setIsLoading(false);}
};

const fetchProductById=async(id)=>{
if(!id)return;
setIsLoading(true);
try{
const res=await fetch(`${API}/products/${id}`);
const data=await res.json();
if(res.ok){setSelectedProduct(data.product||data);setShowViewModal(true);}
else alert(data.message||"Failed to fetch product details");
}catch(err){console.error(err);alert("Backend server error");}
finally{setIsLoading(false);}
};

useEffect(()=>{fetchProducts();},[]);

const handleInputChange=(field,value)=>setFormData(prev=>({...prev,[field]:value}));

const handleResetForm=()=>{
formData.imagePreviews.forEach(url=>URL.revokeObjectURL(url));
setFormData({...initialFormState});
};

const handleImageChange=e=>{
const files=Array.from(e.target.files||[]);
if(!files.length)return;
const previews=files.map(file=>URL.createObjectURL(file));
setFormData(prev=>({...prev,product_images:[...prev.product_images,...files],imagePreviews:[...prev.imagePreviews,...previews]}));
e.target.value="";
};

const handleRemoveImage=(index,e)=>{
e.stopPropagation();
URL.revokeObjectURL(formData.imagePreviews[index]);
setFormData(prev=>({...prev,product_images:prev.product_images.filter((_,i)=>i!==index),imagePreviews:prev.imagePreviews.filter((_,i)=>i!==index)}));
};

const handleSaveProduct=async()=>{
const required=["product_id","product_name","category_name","purity","weight","offer_price","original_price","stock_quantity","product_place","product_description","state","district","mandal","pincode"];
if(required.some(field=>!String(formData[field]).trim()))return alert("Please fill all required fields");
if(!formData.product_images.length)return alert("Please upload at least one image");
setIsLoading(true);
try{
const fd=new FormData();
required.forEach(field=>fd.append(field,formData[field]));
formData.product_images.forEach(file=>fd.append("product_images",file));
const res=await fetch(`${API}/products/add`,{method:"POST",body:fd});
const data=await res.json().catch(()=>({}));
if(res.ok||data.success){
alert("Product added successfully!");
handleResetForm();
setShowAddForm(false);
fetchProducts();
}else alert(data.message||"Failed to save product");
}catch(err){console.error(err);alert("Error saving product");}
finally{setIsLoading(false);}
};

const handleDelete=async(id,e)=>{
e.stopPropagation();
if(!window.confirm("Delete this product?"))return;
try{
const res=await fetch(`${API}/products/${id}`,{method:"DELETE"});
const data=await res.json().catch(()=>({}));
if(res.ok){alert("Deleted successfully");fetchProducts();}
else alert(data.message||"Failed to delete");
}catch(err){console.error(err);alert("Failed to delete");}
};

const parseProductImages=raw=>{
if(!raw)return[];
if(Array.isArray(raw))return raw.filter(Boolean).map(String);
if(typeof raw==="string"){
try{const parsed=JSON.parse(raw);if(Array.isArray(parsed))return parsed.filter(Boolean).map(String);}catch{}
return raw.replace(/[{}[\]"]/g,"").split(",").map(x=>x.trim()).filter(Boolean);
}
return[];
};

const filteredProducts=products.filter(p=>(purityFilter==="All"||(p.purity||"22K")===purityFilter)&&(categoryFilter==="All"||p.category_name===categoryFilter));

return <div style={styles.page}>
<div style={styles.nav}>
<div style={styles.navLeft}><Menu size={22}/><h1 style={styles.h1}>Gold Products Management</h1></div>
<button onClick={()=>setShowAddForm(true)} style={styles.addBtn}><Plus size={18}/>Add Product</button>
</div>

<div style={styles.content}>
<div style={styles.filters}>
<div><label style={styles.label}>Filter by Purity</label><select value={purityFilter} onChange={e=>setPurityFilter(e.target.value)} style={styles.filter}><option value="All">All Purity Levels</option><option>24K</option><option>22K</option><option>18K</option></select></div>
<div><label style={styles.label}>Filter by Category</label><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} style={styles.filter}><option value="All">All Categories</option><option>Necklaces</option><option>Rings</option><option>Earrings</option><option>Bracelets</option></select></div>
</div>

<div style={styles.tableBox}>
<table style={styles.table}>
<thead><tr style={styles.headRow}>{["Product ID","Title","Category","Purity","Weight","Offer Price","Original Price","Stock","Location","Images","Actions"].map(x=><th key={x} style={styles.th}>{x}</th>)}</tr></thead>
<tbody>
{filteredProducts.length===0?<tr><td colSpan="11" style={styles.empty}>{isLoading?"Loading products...":"No products found"}</td></tr>:
filteredProducts.map(prod=>{
const images=parseProductImages(prod.product_images||prod.product_image||prod.images);
const id=prod.id||prod.product_id;
return <tr key={id} onClick={()=>fetchProductById(id)} style={styles.row}>
<td style={styles.td}>{prod.product_id}</td>
<td style={styles.td}>{prod.product_name}</td>
<td style={styles.td}>{prod.category_name}</td>
<td style={styles.td}>{prod.purity||"22K"}</td>
<td style={styles.td}>{prod.weight}g</td>
<td style={{...styles.td,color:"#16a34a",fontWeight:600}}>₹{Number(prod.offer_price||0).toLocaleString("en-IN")}</td>
<td style={{...styles.td,color:"#dc2626"}}>₹{Number(prod.original_price||0).toLocaleString("en-IN")}</td>
<td style={styles.td}>{prod.stock_quantity}</td>
<td style={styles.td}><b>{prod.product_place}</b><br/>{prod.mandal}, {prod.district}, {prod.state}</td>
<td style={styles.td}><div style={styles.images}>{images.length?images.map((url,i)=><img key={i} src={url} alt="product" style={styles.thumb} onError={e=>e.currentTarget.style.display="none"}/>):"No Image"}</div></td>
<td style={styles.td}><div style={styles.actions}>
<button onClick={e=>{e.stopPropagation();fetchProductById(id)}} style={styles.iconBtn}><Eye size={17}/></button>
<button onClick={e=>handleDelete(id,e)} style={{...styles.iconBtn,color:"#dc2626"}}><Trash2 size={17}/></button>
</div></td>
</tr>;
})}
</tbody>
</table>
</div>
</div>

{showAddForm&&<div style={styles.overlay}>
<div style={styles.modal}>
<div style={styles.modalHead}><h2 style={{margin:0}}>Add Gold Product</h2><X style={{cursor:"pointer"}} onClick={()=>setShowAddForm(false)}/></div>
<div style={styles.formBody}>
<h3 style={styles.section}><Info size={18}/>Product Information</h3>
<div style={styles.grid4}>
<FormInput label="Product Name" value={formData.product_name} onChange={v=>handleInputChange("product_name",v)} required/>
<FormInput label="Product ID" value={formData.product_id} onChange={v=>handleInputChange("product_id",v)} required/>
<FormSelect label="Category Name" options={["Necklaces","Rings","Earrings","Bracelets"]} value={formData.category_name} onChange={v=>handleInputChange("category_name",v)} required/>
<FormSelect label="Purity" options={["24K","22K","18K"]} value={formData.purity} onChange={v=>handleInputChange("purity",v)} required/>
<FormInput label="Weight (grams)" type="number" value={formData.weight} onChange={v=>handleInputChange("weight",v)} required/>
<FormInput label="Offer Price" type="number" value={formData.offer_price} onChange={v=>handleInputChange("offer_price",v)} required/>
<FormInput label="Original Price" type="number" value={formData.original_price} onChange={v=>handleInputChange("original_price",v)} required/>
<FormInput label="Stock Quantity" type="number" value={formData.stock_quantity} onChange={v=>handleInputChange("stock_quantity",v)} required/>
</div>

<div style={styles.grid2}>
<div><label style={styles.label}>Product Description *</label><textarea value={formData.product_description} onChange={e=>handleInputChange("product_description",e.target.value)} style={styles.textarea}/></div>
<div><label style={styles.label}>Product Images *</label>
<input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} style={{display:"none"}}/>
<button type="button" onClick={()=>fileInputRef.current?.click()} style={styles.upload}><Upload size={18}/>Upload Images</button>
<div style={styles.preview}>{formData.imagePreviews.map((url,i)=><div key={url} style={styles.previewItem}><img src={url} alt="preview" style={styles.previewImg}/><button onClick={e=>handleRemoveImage(i,e)} style={styles.remove}>×</button></div>)}</div>
</div>
</div>

<div style={styles.grid1}><FormInput label="Product Place" value={formData.product_place} onChange={v=>handleInputChange("product_place",v)} required/></div>
<h3 style={styles.section}><MapPin size={18}/>Location Information</h3>
<div style={styles.grid4}>
<FormSelect label="State" options={["Andhra Pradesh","Telangana","Karnataka","Tamil Nadu","Kerala","Maharashtra","Delhi","Other"]} value={formData.state} onChange={v=>handleInputChange("state",v)} required/>
<FormInput label="District" value={formData.district} onChange={v=>handleInputChange("district",v)} required/>
<FormInput label="Mandal" value={formData.mandal} onChange={v=>handleInputChange("mandal",v)} required/>
<FormInput label="Pincode" value={formData.pincode} onChange={v=>handleInputChange("pincode",v)} required/>
</div>

<div style={styles.footer}>
<button onClick={handleResetForm} style={styles.secondary}><RotateCcw size={16}/>Reset</button>
<button onClick={handleSaveProduct} disabled={isLoading} style={styles.primary}><Save size={16}/>{isLoading?"Saving...":"Save Product"}</button>
</div>
</div>
</div>
</div>}

{showViewModal&&selectedProduct&&<div style={styles.overlay}>
<div style={{...styles.modal,maxWidth:850}}>
<div style={styles.modalHead}><h2 style={{margin:0,fontSize:20}}>Product Details</h2><X style={{cursor:"pointer"}} onClick={()=>{setShowViewModal(false);setSelectedProduct(null)}}/></div>
<div style={styles.formBody}>
<div style={styles.grid2}>
<div>
<div style={styles.detailImages}>{parseProductImages(selectedProduct.product_images||selectedProduct.product_image||selectedProduct.images).map((url,i)=><img key={i} src={url} alt="product" style={styles.detailImg}/>)}</div>
<h4>Description</h4><p>{selectedProduct.product_description||"No description"}</p>
</div>
<div style={styles.details}>
{[
["Product ID",selectedProduct.product_id],["Product Name",selectedProduct.product_name],["Category",selectedProduct.category_name],["Purity",selectedProduct.purity||"22K"],["Weight",`${selectedProduct.weight||0} grams`],["Offer Price",`₹${Number(selectedProduct.offer_price||0).toLocaleString("en-IN")}`],["Original Price",`₹${Number(selectedProduct.original_price||0).toLocaleString("en-IN")}`],["Stock",selectedProduct.stock_quantity],["Place",selectedProduct.product_place],["Location",`${selectedProduct.mandal||""}, ${selectedProduct.district||""}, ${selectedProduct.state||""}`],["Pincode",selectedProduct.pincode]
].map(([label,value])=><div key={label} style={styles.detail}><small>{label}</small><b>{value||"-"}</b></div>)}
</div>
</div>
</div>
</div>
</div>}
</div>;
};

const FormInput=({label,type="text",value,onChange,required})=><div><label style={styles.label}>{label}{required&&" *"}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} style={styles.input}/></div>;
const FormSelect=({label,options,value,onChange,required})=><div><label style={styles.label}>{label}{required&&" *"}</label><select value={value} onChange={e=>onChange(e.target.value)} style={styles.input}><option value="">Select {label}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;

const styles={
page:{minHeight:"100vh",background:"#f8f9fa",fontFamily:"Arial,sans-serif"},
nav:{height:64,background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",borderBottom:"1px solid #ddd"},
navLeft:{display:"flex",alignItems:"center",gap:18},h1:{fontSize:20,margin:0},addBtn:{background:"#d97706",color:"#fff",border:0,padding:"10px 18px",borderRadius:6,display:"flex",gap:8,cursor:"pointer"},
content:{padding:24},filters:{background:"#fff",padding:20,borderRadius:8,display:"flex",gap:24,marginBottom:24,border:"1px solid #ddd"},
label:{display:"block",fontSize:13,fontWeight:700,marginBottom:7},filter:{height:38,width:180,padding:"0 10px",border:"1px solid #ccc",borderRadius:6},
tableBox:{background:"#fff",overflowX:"auto",border:"1px solid #ddd",borderRadius:8},table:{width:"100%",minWidth:1200,borderCollapse:"collapse"},headRow:{background:"#f0fdf4"},th:{padding:14,textAlign:"left"},td:{padding:14,borderBottom:"1px solid #eee",fontSize:13},row:{cursor:"pointer"},empty:{padding:50,textAlign:"center"},images:{display:"flex",gap:5,flexWrap:"wrap"},thumb:{width:40,height:40,objectFit:"cover",borderRadius:5},actions:{display:"flex",gap:8},iconBtn:{background:"none",border:0,cursor:"pointer",color:"#d97706"},
overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,overflowY:"auto",padding:"30px 0"},modal:{background:"#fff",width:"92%",maxWidth:1400,margin:"0 auto",borderRadius:12,overflow:"hidden"},modalHead:{padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #eee"},formBody:{padding:30},section:{display:"flex",alignItems:"center",gap:8,color:"#b45309"},grid4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:20},grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:20},grid1:{marginBottom:20},input:{width:"100%",height:42,padding:"0 10px",boxSizing:"border-box",border:"1px solid #ccc",borderRadius:6},textarea:{width:"100%",height:130,padding:10,boxSizing:"border-box",border:"1px solid #ccc",borderRadius:6},upload:{padding:"10px 15px",background:"#fef3c7",border:"1px dashed #d97706",borderRadius:6,cursor:"pointer",display:"flex",gap:7,alignItems:"center"},preview:{display:"flex",gap:8,flexWrap:"wrap",marginTop:12},previewItem:{position:"relative"},previewImg:{width:70,height:70,objectFit:"cover",borderRadius:5},remove:{position:"absolute",right:-5,top:-5,border:0,borderRadius:"50%",background:"#dc2626",color:"#fff",cursor:"pointer"},footer:{display:"flex",justifyContent:"space-between",borderTop:"1px solid #eee",paddingTop:20},primary:{background:"#ca8a04",color:"#fff",border:0,borderRadius:6,padding:"10px 20px",cursor:"pointer",display:"flex",gap:7,alignItems:"center"},secondary:{background:"#fff",border:"1px solid #ccc",borderRadius:6,padding:"10px 20px",cursor:"pointer",display:"flex",gap:7,alignItems:"center"},detailImages:{display:"flex",gap:10,flexWrap:"wrap"},detailImg:{width:100,height:100,objectFit:"cover",borderRadius:7},details:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},detail:{background:"#f8fafc",padding:12,border:"1px solid #e2e8f0",borderRadius:7,display:"flex",flexDirection:"column",gap:5}
};

export default GoldProductsDashboard;
