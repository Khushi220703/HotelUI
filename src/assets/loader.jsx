import ReactLoading from 'react-loading';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
    <ReactLoading type="bars" color="#ff5a5f" height={50} width={50} />
  </div>
);


export default Loader;
