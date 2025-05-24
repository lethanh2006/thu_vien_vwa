import React from 'react';
import Barcode from 'react-barcode'; // nếu bạn import Barcode tại đây
import './style.less';

type PrintBarcodeProps = {
	listBarcodes: string[];
	isCompact?: boolean;
};

const PrintBarcode = React.forwardRef<HTMLDivElement, PrintBarcodeProps>(({ listBarcodes, isCompact }, ref) => {
	return (
		<div className={`print-section ${isCompact ? 'compact' : ''}`} ref={ref} style={{ width: '100%' }}>
			<div className='to-print'>
				{listBarcodes.map((item, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index} className='barcode-item'>
						<div style={{ marginTop: 7, fontSize: 14, marginBottom: -12, zIndex: 2, fontFamily: 'Calibri' }}>
							TV - HVCNBCVT
						</div>
						<Barcode value={item} height={36} fontSize={14} width={1.6} font='Calibri' />
					</div>
				))}
			</div>
		</div>
	);
});

export default PrintBarcode;
