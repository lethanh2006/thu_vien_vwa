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
import GhiTraAnPham from './GhiTraSach';
import XuLyDonMuonTra from './XuLyDon';

const ChiTietMuonTraSach = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('sachtailieu.muontra.muontra');
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
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
						<Descriptions.Item label='Thời gian đăng ký'>
							{record?.thoiGianDangKy ? moment(record?.thoiGianDangKy).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian mượn'>
							{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('HH:mm DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Hạn trả'>{record?.expired ? `${record?.expired} ngày` : '--'}</Descriptions.Item>
						{record?.trangThai === ETrangThaiMuonSach.DA_TRA ? (
							<Descriptions.Item label='Thời gian trả'>
								{record?.thoiGianTra ? moment(record?.thoiGianTra).format('HH:mm DD/MM/YYYY') : '--'}
							</Descriptions.Item>
						) : null}
						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>{record?.trangThai}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái duyệt'>
							<Tag color={colorTrangThaiDuyeMuonSach[record?.trangThaiDuyet as ETrangThaiDuyeMuonSach]}>
								{record?.trangThaiDuyet}
							</Tag>
						</Descriptions.Item>

						{record?.anPhamId ? (
							<Descriptions.Item label='Ấn phẩm'>{record?.anPham?.ten ?? 'Không có thông tin'}</Descriptions.Item>
						) : null}

						{record?.thongTinAnPhamId ? (
							<Descriptions.Item label='Thông tin ấn phẩm'>
								{record?.thongTinAnPham?.tagCode}
								{record?.thongTinAnPham?.value
									? record?.thongTinAnPham?.value
									: record?.thongTinAnPham?.danhSachThuocTinhAnPham
											?.map((item) => `${item?.code} - ${item?.value}`)
											.join(', ')}
							</Descriptions.Item>
						) : null}
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				{/* <Button disabled={record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY}>In phiếu</Button> */}
				{record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY ? (
					<>
						<ButtonExtend
							className='text-error'
							onClick={() => {
								setVisibleForm(false);
								setTrangThai(ETrangThaiDuyeMuonSach.KHONG_DUYET);
								setVisibleXuLy(true);
							}}
						>
							Không duyệt
						</ButtonExtend>
						<ButtonExtend
							className='text-success'
							onClick={() => {
								setVisibleForm(false);
								setTrangThai(ETrangThaiDuyeMuonSach.DA_DUYET);
								setVisibleXuLy(true);
							}}
						>
							Duyệt
						</ButtonExtend>
					</>
				) : null}

				{record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
					<ButtonExtend
						className='text-success'
						onClick={() => {
							setVisibleForm(false);
							setVisibleGhiTra(true);
						}}
					>
						Ghi trả
					</ButtonExtend>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

			<XuLyDonMuonTra trangThai={trangThai} visible={visibleXuLy} setVisible={setVisibleXuLy} getData={getData} />
			<GhiTraAnPham visible={visibleGhiTra} setVisible={setVisibleGhiTra} getData={getData} />
		</Card>
	);
};

export default ChiTietMuonTraSach;
