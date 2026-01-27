import { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { Col, Row } from 'antd';
import { useIntl } from 'umi';

const TitlePrintMuonTra = (props: {
	vaiTro?: EVaiTroMuonTra;
	recSinhVien?: SinhVien.IRecord;
	recCanBo?: ToChucNhanSu.INhanSu;
}) => {
	const { vaiTro, recSinhVien, recCanBo } = props;
	const intl = useIntl();
	return (
		<div className='to-print'>
			<div className='title'>{intl.formatMessage({ id: 'sachtailieu.muontra.print.title' })}</div>
			<Row gutter={[12, 0]} style={{ fontSize: 13 }}>
				{vaiTro === EVaiTroMuonTra.SINHVIEN ? (
					<>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.ma' })}: <b>{recSinhVien?.ma ?? '--'}</b>
						</Col>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.hoten' })}: <b>{recSinhVien?.ten ?? '--'}</b>
						</Col>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.lop' })}:{' '}
							<b>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</b>
						</Col>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.khoasinhvien' })}:{' '}
							<b>{recSinhVien?.khoaSinhVien?.ten ?? '--'}</b>
						</Col>
						<Col span={24}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.khoanganh' })}:{' '}
							<b>{recSinhVien?.khoaNganh?.ten ?? '--'}</b>
						</Col>
					</>
				) : (
					<>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.macanbo' })}: <b>{recCanBo?.maCanBo ?? '--'}</b>
						</Col>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.hoten' })}:{' '}
							<b> {[recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')}</b>
						</Col>
						<Col span={12}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.print.donvi' })}: {recCanBo?.donViChinh?.ten ?? '--'}
						</Col>
					</>
				)}
			</Row>
		</div>
	);
};

export default TitlePrintMuonTra;
