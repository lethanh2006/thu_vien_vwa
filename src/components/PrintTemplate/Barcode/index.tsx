import React from 'react';
import Barcode from 'react-barcode';
import './style.less';

type PrintBarcodeProps = {
	listBarcodes: string[];
};

const PrintBarcode = React.forwardRef<HTMLDivElement, PrintBarcodeProps>(({ listBarcodes }, ref) => {
	return (
		<div className='print-section' ref={ref} style={{ width: '100%' }}>
			<div className='to-print'>
				{listBarcodes
					.filter((item) => !!item)
					.map((item, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<div className='barcode-item' key={index}>
							<div
								className='barcode-header'
								style={{ marginTop: 12, fontSize: 14, marginBottom: -8, zIndex: 2, fontFamily: 'Calibri' }}
							>
								TV - HVCNBCVT
							</div>
							<Barcode value={item} height={35} fontSize={16} width={1.8} font='Calibri' fontOptions='bold' />
						</div>
					))}
			</div>
		</div>
	);
});

export default PrintBarcode;
