import { GetServerSideProps } from "next";

export default function Routes() {
	return <></>;
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			permanent: true,
			destination: "/dashboard/Aave/V2/Ethereum"
		}
	};
};
