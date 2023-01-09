package gstat

type GstatError string

func (e GstatError) Error() string {
	return string(e)
}
