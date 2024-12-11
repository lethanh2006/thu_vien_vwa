import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ChiTietAnPham = () => {
	const intl = useIntl();
	const {
		record: recAnPham,
		setVisibleForm,
		getAllModel,
		loading,
		visibleForm,
	} = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const [danhSachTag, setDanhSachTag] = useState<AnPham.IThongTinAnPham[]>([]);
	const [tagCode, setTagCode] = useState<string>();

	useEffect(() => {
		if (!visibleForm) setTagCode(undefined);
	}, [visibleForm]);

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, `${recAnPham?._id}/tag`, false).then((res) =>
			setDanhSachTag(res as any),
		);
	}, [recAnPham?._id]);

	const getData = () => {
		if (recAnPham?._id && tagCode)
			getModel(undefined, undefined, undefined, undefined, undefined, `an-pham/${recAnPham?._id}/tag/${tagCode}/page`);
	};

	useEffect(() => {
		getData();
	}, [tagCode]);

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			title: 'Nhãn',
			dataIndex: 'tagCode',
			align: 'center',
			width: 120,
		},
		{
			title: 'Nội dung trường',
			width: 220,
			render: (val, rec) => rec?.danhSachThuocTinhAnPham?.map((i) => `${i.code}${i.value}`).join(', '),
		},
	];

	return (
		<Card title='Chi tiết ấn phẩm'>
			<div>
				<h2>
					{recAnPham?.ten} {recAnPham?.nhanDe}
				</h2>
				<UserOutlined /> {recAnPham?.tacGia}
			</div>
			<Spin spinning={loading}>
				<div style={{ marginTop: 12 }}>
					{danhSachTag?.map((item) => (
						<div key={item?._id}>
							<b>
								<span style={{ fontSize: 24 }}>{item?.tag?.ma ?? ''}</span>
								{item?.tag?.noiDung ?? ''} ({item?.total})
							</b>

							{item?.tagCode === tagCode && danhSach?.length ? null : (
								<div style={{ marginLeft: 12 }}>
									<p>
										{item?.danhSachThuocTinhAnPham?.map((i) => `${i.code}${i.value}`).join(', ')}{' '}
										{item?.total && item?.total > 1 ? (
											<a onClick={() => setTagCode(item?.tagCode)}>Xem chi tiết</a>
										) : null}
									</p>
								</div>
							)}

							{item?.tagCode === tagCode && danhSach?.length ? (
								<TableBase
									getData={getData}
									columns={columns}
									dependencies={[page, limit, tagCode]}
									modelName='sachtailieu.anpham.thongtinanpham'
									hideCard
									buttons={{ create: false }}
									otherProps={{ size: 'small' }}
								/>
							) : null}
						</div>
					))}
				</div>
			</Spin>
			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ChiTietAnPham;
