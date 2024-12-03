import { Card, Empty } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';
import CardAnPham from './CardAnPham';
import ThongTinAnPham from './ThongTinAnPham';

const AnPhamPage = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('40%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	return (
		<Card title='Thông tin ấn phẩm'>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<Card
						title='Danh sách ấn phẩm'
						bodyStyle={{ padding: '8px 0 0' }}
						headStyle={{ padding: 0 }}
						bordered={false}
					>
						<CardAnPham />
					</Card>
				</Pane>
				<Pane minSize='40%'>
					{recAnPham?._id ? (
						<Card
							title='Thông tin ấn phẩm'
							bodyStyle={{ padding: '8px 0 0' }}
							headStyle={{ padding: 0 }}
							bordered={false}
						>
							<ThongTinAnPham />
						</Card>
					) : (
						<Empty
							style={{ marginTop: 32, marginBottom: 32 }}
							description={'Vui lòng chọn chương trình đào tạo trước!'}
						/>
					)}
				</Pane>
			</SplitPane>
		</Card>
	);
};

export default AnPhamPage;
