package glog

//DevNull is a null implementation of the logger interface. Does nothing.
type DevNull struct{}

func NewDevNull() *DevNull {
	return &DevNull{}
}

func (l *DevNull) IsDebugEnabled() bool {
	return false
}
func (l *DevNull) GetLogLevel() string {
	return "empty"
}
func (l *DevNull) Trace(_ ...interface{})            {}
func (l *DevNull) Tracef(_ string, _ ...interface{}) {}
func (l *DevNull) Debug(_ ...interface{})            {}
func (l *DevNull) Debugf(_ string, _ ...interface{}) {}
func (l *DevNull) Info(_ ...interface{})             {}
func (l *DevNull) Infof(_ string, _ ...interface{})  {}
func (l *DevNull) Warn(_ ...interface{})             {}
func (l *DevNull) Warnf(_ string, _ ...interface{})  {}
func (l *DevNull) Error(_ ...interface{})            {}
func (l *DevNull) Errorf(_ string, _ ...interface{}) {}
func (l *DevNull) Fatal(_ ...interface{})            {}
func (l *DevNull) Fatalf(_ string, _ ...interface{}) {}
