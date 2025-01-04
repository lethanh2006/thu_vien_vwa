import { Button, Card, Descriptions } from 'antd';
import { useIntl, useModel } from 'umi';

const ChiTietBienMuc = (props: any) => {
	const { isAnPham } = props;
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('sachtailieu.anpham.anpham');

	const content = (
		<Descriptions column={{ xs: 1, md: 2 }} bordered>
			{/* <Descriptions.Item label='Mã tài liệu'>{record?.maTaiLieu ?? '--'}</Descriptions.Item> */}
			<Descriptions.Item label='Nhan đề chính [245$a]'>{record?.nhanDe ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Tác giả [100$a]'>{record?.tacGia ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Kiểu bản ghi'>{record?.kieuBanGhi?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Dạng tài liệu'>{record?.dangTaiLieu?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Cấp thư mục'>{record?.capThuMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Vật mang tin'>{record?.vatMangTin?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Mẫu biên mục'>{record?.mauBienMuc?.ten ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Độ mât'>{record?.doMat ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='ISBN [020$a]'>{record?.ISBN ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='ISSN [022$a]'>{record?.ISSN ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Số thứ tự của tập [245$n]'>{record?.soThuTuCuaTap ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Tên tập [245$p]'>{record?.tenTap ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Phụ đề [245$b]'>{record?.phuDe ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Thông tin trách nhiệm [245$c]'>{record?.thongTinTrachNhiem ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Lần xuất bản [250$a]'>{record?.lanXuatBan ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Nơi xuất bản [260$a]'>{record?.noiXuatBan ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Năm xuất bản [260$c]'>{record?.namXuatBan ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Nhà xuất bản [260$b]'>{record?.nhaXuatBan ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Số trang [300$a]'>{record?.soTrang ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Đặc điểm vật lý [300$b]'>{record?.dacDiemVatLy ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Khuôn khổ [300$c]'>{record?.khuonKho ?? '--'}</Descriptions.Item>
			<Descriptions.Item label='Tư liệu đi kèm [300$e]'>{record?.tuLieuDiKem ?? '--'}</Descriptions.Item>
		</Descriptions>
	);

	if (isAnPham) return content;

	return (
		<Card title='Chi tiết biên mục'>
			{content}
			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Card>
	);
};

export default ChiTietBienMuc;
