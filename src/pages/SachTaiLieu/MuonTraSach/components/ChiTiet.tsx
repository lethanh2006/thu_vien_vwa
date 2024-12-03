import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiDuyeMuonSach,
	colorTrangThaiMuonSach,
	ETrangThaiDuyeMuonSach,
	ETrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import { Button, Card, Col, Descriptions, Row, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import XuLyDonMuonTra from './XuLyDon';

const ChiTietMuonTraSach = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('sachtailieu.muontra.muontra');
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<ETrangThaiDuyeMuonSach>();

	return (
		<Card title='Chi tiết sinh viên mượn sách'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã sinh viên'>{record?.maDinhDanhNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.hotenNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='ĐKCB'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tên sách'>--</Descriptions.Item>
						<Descriptions.Item label='Ngày mượn'>
							{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Hạn trả'>
							{record?.thoiGianTra ? moment(record?.thoiGianTra).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>{record?.trangThai}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái duyệt'>
							<Tag color={colorTrangThaiDuyeMuonSach[record?.trangThaiDuyet as ETrangThaiDuyeMuonSach]}>
								{record?.trangThaiDuyet}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button disabled={record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY}>In phiếu</Button>
				<ButtonExtend
					disabled={
						record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ||
						record?.trangThai === ETrangThaiMuonSach.KHONG_CHO_THUE_MUON
					}
					className='text-error'
					onClick={() => {
						setVisibleForm(false);
						setTrangThai(ETrangThaiDuyeMuonSach.KHONG_DUYET);
						setVisibleXuLy(true);
					}}
				>
					Thu hồi
				</ButtonExtend>
				<ButtonExtend
					disabled={
						record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ||
						record?.trangThai === ETrangThaiMuonSach.KHONG_CHO_THUE_MUON
					}
					className='text-success'
					onClick={() => {
						setVisibleForm(false);
						setTrangThai(ETrangThaiDuyeMuonSach.DA_DUYET);
						setVisibleXuLy(true);
					}}
				>
					Ghi trả
				</ButtonExtend>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

			<XuLyDonMuonTra trangThai={trangThai} visible={visibleXuLy} setVisible={setVisibleXuLy} getData={getData} />
		</Card>
	);
};

export default ChiTietMuonTraSach;
