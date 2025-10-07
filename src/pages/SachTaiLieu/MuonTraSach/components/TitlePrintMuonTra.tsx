import { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { Col, Row } from 'antd';

const TitlePrintMuonTra = (props: {
	vaiTro?: EVaiTroMuonTra;
	recSinhVien?: SinhVien.IRecord;
	recCanBo?: ToChucNhanSu.INhanSu;
}) => {
	const { vaiTro, recSinhVien, recCanBo } = props;
	return (
		<div className='to-print'>
			<div className='title'>PHIẾU MƯỢN TÀI LIỆU</div>
			<Row gutter={[12, 0]} style={{ fontSize: 13 }}>
				{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
					<>
						<Col span={12}>
							Mã SV: <b>{recSinhVien?.ma ?? '--'}</b>
						</Col>
						<Col span={12}>
							Họ tên: <b>{recSinhVien?.ten ?? '--'}</b>
						</Col>
						<Col span={12}>
							Lớp: <b>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</b>
						</Col>
						<Col span={12}>
							Khóa sinh viên: <b>{recSinhVien?.khoaSinhVien?.ten ?? '--'}</b>
						</Col>
						<Col span={24}>
							Khóa ngành: <b>{recSinhVien?.khoaNganh?.ten ?? '--'}</b>
						</Col>
					</>
				) : (
					<>
						<Col span={12}>
							Mã cán bộ: <b>{recCanBo?.maCanBo ?? '--'}</b>
						</Col>
						<Col span={12}>
							Họ tên: <b> {[recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')}</b>
						</Col>
						<Col span={12}>Đơn vị: {recCanBo?.donViChinh?.ten ?? '--'}</Col>
					</>
				)}
			</Row>
		</div>
	);
};

export default TitlePrintMuonTra;
