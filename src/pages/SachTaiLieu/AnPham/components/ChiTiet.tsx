import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { UserOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ChiTietAnPham = () => {
	const {
		record: recAnPham,
		getChiTietAnPhamModal,
		loadingChiTiet,
		visibleForm,
		danhSachTag,
	} = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const [tagCode, setTagCode] = useState<string>();

	useEffect(() => {
		if (!visibleForm) setTagCode(undefined);
	}, [visibleForm]);

	useEffect(() => {
		if (recAnPham?._id) getChiTietAnPhamModal(recAnPham?._id);
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
			render: (val, rec) => (
				<ExpandText>{rec?.thuocTinhAnPham?.map((i) => `${i.code}${i.value}`).join(', ')}</ExpandText>
			),
		},
	];

	return (
		<>
			<div>
				<h2>
					{recAnPham?.maTaiLieu} {recAnPham?.nhanDe}
				</h2>
				<UserOutlined /> {recAnPham?.tacGia}
			</div>
			<Spin spinning={loadingChiTiet}>
				<div style={{ marginTop: 12 }}>
					{danhSachTag?.map((item) => (
						<div key={item?._id}>
							<b>
								<span style={{ fontSize: 18 }}>{item?.tag?.ma ?? ''}</span>
								{item?.tag?.noiDung ?? ''} ({item?.total})
							</b>

							{item?.tagCode === tagCode && danhSach?.length ? null : (
								<div style={{ marginLeft: 12 }}>
									<p>
										{item?.thuocTinhAnPham?.map((i) => `${i.code}${i.value}`).join(', ')}{' '}
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
		</>
	);
};

export default ChiTietAnPham;
