import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import '../styles/category.css'

function Category({category,}) {


  const [page, setPage] = useState(1);
  const pageSize = 7;
  const totalPages = Math.ceil(category.length / pageSize);
  const [cat,setCategory] = useState("")

  const lower = (page - 1) * pageSize;
  const upper = page * pageSize;

  const visibleCategories = category.slice(lower, upper);

  function incrementPage() {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }

  function decrementPage() {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }

  useEffect(() => {
  }, [page]);


  console.log(cat)
  return (
    <div className='category'>
        <div className="row justify-content-center">
            <div className='col-md-9'>
                <h4>Browse By Category</h4>
                <div className='d-flex justify-content-between'>
                  <button onClick={incrementPage} className={page===totalPages? "plus":""}>&gt;&gt;</button>
                  <button onClick={decrementPage} className={page===1? "minus":""}>&lt;&lt;</button>
                </div>
                <div className="row col-md-12">
                  {
                    visibleCategories.map((item)=>{
                      return(
                          <Card key={item.id} className='cat-card'>
                            <Card.Img  src={`http://localhost:8000/${item.icon}`}/>
                              <p>{item.name}</p>
                          </Card>
                      )
                    })
                  }
                </div>
            </div>
                
        </div>
    </div>
  )
}

export default Category