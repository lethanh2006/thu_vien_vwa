import { useEffect } from 'react';
import { useModel } from 'umi';

const StatThongKeMuonTra = () => {
	const { thongKeTongSoMuonTraAnPhamModel } = useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		thongKeTongSoMuonTraAnPhamModel();
	}, []);

	return <div>StatThongKeMuonTra</div>;
};

export default StatThongKeMuonTra;
