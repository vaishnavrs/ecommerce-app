import Card from 'react-bootstrap/Card';
import '../styles/product.css'
import CardImg from 'react-bootstrap/esm/CardImg';
import { useNavigate } from 'react-router-dom';

function ProductCard({products,cat}){
    const navigate = useNavigate()
     return (
    <>
      {products.map((item) => (
        <Card
          key={item.id}
          onClick={() => navigate(`/product_details/${item.id}`, { state: item })}
          className="product-card"
        >
          <Card.Body>
            <CardImg src={item.product_image} />
            <p className="name">{item.product_name}</p>
            <p className="price">&#8377;{item.product_price}</p>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}


export default ProductCard