import "./modal.css";

const Modal = ({ children, show, onClose, title }) => {
  return (
    show && (
      <>
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-wrapper">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">{title}</div>
              <div onClick={onClose} className="modal-close">
                X
              </div>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </>
    )
  );
};

export default Modal;