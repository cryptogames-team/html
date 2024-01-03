import { Link } from "react-router-dom";


export default function Home() {
    return (
        <>
          home  
          <Link to={"/test"}>테스트 페이지</Link>
        </>
    )    
}