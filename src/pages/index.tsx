import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/auth/sign-in',
      permanent: false,
    },
  };
};

const IndexPage = () => null;

export default IndexPage;