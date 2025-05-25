import React, { useEffect, useState } from 'react'
import {fetchProduct,fetchCategory} from '../api/fetchProducts'
import Category from './Category'
import InfiniteScroll from 'react-infinite-scroll-component';
import '../styles/product.css'
import ProductCard from './ProductCard';



function AllProducts() {

    const [products,setProducts] = useState([])
    const [categories,SetCategories] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

  


    const fetchMoreProducts = async () => {
        try {
          const data = await fetchProduct(page);
          setProducts(prev => [...prev, ...data.results]);
          if (!data.next) {
            setHasMore(false); 
          }
          else{
            setPage(prev => prev + 1); 
          }
        } catch (error) {
          console.log("Error fetching products:", error);
        }
      };
      


    
    useEffect(()=>{
        const initialFetch = async()=>{
            try{
                const initialpage  = 1
                const data = await fetchProduct(initialpage)
                const cat = await fetchCategory()
                setProducts(data.results)
                SetCategories(cat)

                if(!data.next){
                    setHasMore(false)
                }else{
                    setPage(2)
                }
            }
            catch(error){
                console.log(error)
            }
        }
        initialFetch()
    },[])


  return (
    <div className='product'>
        <Category category={categories}/>
        <div className='row'>
            <h5 className=''>Explore our products</h5>
        </div>
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreProducts}
            hasMore={hasMore}
            loader={<h4>loading....</h4>}
            endMessage={<p className='text-center'>no more products</p>}>
           <div className="row justify-content-center">
                <div className="col-md-9">
                    <div className="d-flex flex-wrap justify-content-start gap-3">
                        <ProductCard products={products}/>
                    </div>
                </div>
            </div>
        </InfiniteScroll>
        
    </div>
  )
}

export default AllProducts