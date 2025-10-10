import Login from "../components/Login";
import RequestRole from "../components/RequestRole";
import { useWallet } from "../context/metamask/provider";

const Home = () => {
  const { account } = useWallet();
  return account ? <RequestRole /> : <Login />;
};

export default Home;
